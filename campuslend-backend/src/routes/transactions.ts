import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction, { TransactionStatus } from '../models/Transaction';
import Item from '../models/Item';
import User from '../models/User';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Enforce authentication across all transaction endpoints
router.use(authenticate);

/* ─────────────────────────────────────────────
 * POST /api/transactions/request
 * Atomic item borrowing reservation — Double-booking prevention via Atomic CAS
 * Body: { itemId: string, borrowDuration: string, notes?: string }
 * ───────────────────────────────────────────── */
router.post(
  '/request',
  validate([
    { field: 'itemId', required: true, type: 'string' },
    { field: 'borrowDuration', required: true, type: 'string', minLength: 1, maxLength: 100 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { itemId, borrowDuration, notes } = authReq.body;
    const borrowerId = authReq.userId;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ error: 'Invalid item ID format' });
      return;
    }

    // Step 1: Pre-fetch item to check existence & ownership
    const targetItem = await Item.findById(itemId);
    if (!targetItem) {
      res.status(404).json({ error: 'Item not found in inventory' });
      return;
    }

    // Borrower cannot borrow their own item
    if (targetItem.owner?.toString() === borrowerId || targetItem.ownerEmail === authReq.user.email) {
      res.status(400).json({ error: 'Prohibited: You cannot borrow your own listed item' });
      return;
    }

    // Quick status check before attempting reservation
    if (targetItem.status !== 'available') {
      res.status(409).json({
        error: `Item is currently ${targetItem.status} and not available for borrowing.`,
      });
      return;
    }

    // Resolve lender ID
    let lenderId = targetItem.owner;
    if (!lenderId) {
      const lenderUser = await User.findOne({ email: targetItem.ownerEmail });
      lenderId = lenderUser?._id;
    }

    if (!lenderId) {
      res.status(400).json({ error: 'Item owner profile could not be resolved' });
      return;
    }

    // Attempt session start if MongoDB deployment is a replica set / cluster
    let session: mongoose.ClientSession | null = null;
    try {
      const s = await mongoose.startSession();
      s.startTransaction();
      session = s;
    } catch {
      // Standalone mongod does not support multi-document transactions; proceed with atomic CAS + compensation
      session = null;
    }

    try {
      // Step 2: ATOMIC COMPARE-AND-SWAP (CAS)
      // Only updates if status is strictly 'available' at the exact millisecond of write
      const reservedItem = await Item.findOneAndUpdate(
        { _id: itemId, status: 'available' },
        { $set: { status: 'reserved' } },
        { new: true, session: session || undefined },
      );

      if (!reservedItem) {
        if (session) await session.abortTransaction();
        res.status(409).json({
          error: 'Concurrency conflict: This item was just reserved by another student.',
        });
        return;
      }

      // Step 3: Create transaction record (protected by partial unique index on active item transactions)
      const transaction = new Transaction({
        item: itemId,
        borrower: borrowerId,
        lender: lenderId,
        status: 'pending' as TransactionStatus,
        borrowDuration: String(borrowDuration).trim(),
        notes: typeof notes === 'string' ? notes.trim() : undefined,
        requestedAt: new Date(),
      });

      await transaction.save({ session: session || undefined });

      if (session) {
        await session.commitTransaction();
      }

      const populated = await Transaction.findById(transaction._id)
        .populate('item', 'title category status ownerEmail maxBorrowTime is_verified')
        .populate('borrower', 'name email is_verified communityScore')
        .populate('lender', 'name email is_verified communityScore');

      res.status(201).json(populated);
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      } else {
        // Standalone compensation rollback: ensure item is not left locked in reserved status
        await Item.findByIdAndUpdate(itemId, { $set: { status: 'available' } });
      }

      const mongoErr = error as { code?: number; message?: string };
      if (mongoErr.code === 11000) {
        res.status(409).json({
          error: 'An active borrow request already exists for this item.',
        });
        return;
      }

      res.status(500).json({ error: mongoErr.message || 'Failed to process reservation request' });
    } finally {
      if (session) {
        session.endSession();
      }
    }
  },
);

/* ─────────────────────────────────────────────
 * PUT /api/transactions/:id/approve
 * Lender approves the borrow request
 * ───────────────────────────────────────────── */
router.put('/:id/approve', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    if (transaction.lender.toString() !== authReq.userId) {
      res.status(403).json({ error: 'Only the item owner can approve this borrow request' });
      return;
    }

    if (transaction.status !== 'pending') {
      res.status(400).json({ error: `Cannot approve a transaction with status "${transaction.status}"` });
      return;
    }

    transaction.status = 'approved';
    transaction.approvedAt = new Date();
    await transaction.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('item', 'title category status')
      .populate('borrower', 'name email is_verified')
      .populate('lender', 'name email is_verified');

    res.json(populated);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to approve borrow request' });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/transactions/:id/pickup
 * Mark item as picked up (active borrow)
 * ───────────────────────────────────────────── */
router.put('/:id/pickup', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    // Either borrower or lender can acknowledge pickup
    const isParticipant =
      transaction.borrower.toString() === authReq.userId ||
      transaction.lender.toString() === authReq.userId;

    if (!isParticipant) {
      res.status(403).json({ error: 'Unauthorized to update this transaction' });
      return;
    }

    if (transaction.status !== 'approved') {
      res.status(400).json({ error: 'Transaction must be approved by the owner before pickup' });
      return;
    }

    transaction.status = 'active';
    transaction.pickedUpAt = new Date();
    await transaction.save();

    // Atomically transition item status to active
    await Item.findByIdAndUpdate(transaction.item, { $set: { status: 'active' } });

    // Increment borrower stats
    await User.findByIdAndUpdate(transaction.borrower, { $inc: { totalBorrows: 1 } });

    const populated = await Transaction.findById(transaction._id)
      .populate('item', 'title category status')
      .populate('borrower', 'name email is_verified')
      .populate('lender', 'name email is_verified');

    res.json(populated);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to confirm item pickup' });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/transactions/:id/return
 * Mark item as returned — Atomic status reset
 * ───────────────────────────────────────────── */
router.put('/:id/return', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const isParticipant =
      transaction.borrower.toString() === authReq.userId ||
      transaction.lender.toString() === authReq.userId;

    if (!isParticipant) {
      res.status(403).json({ error: 'Unauthorized to mark this item as returned' });
      return;
    }

    if (transaction.status !== 'active') {
      res.status(400).json({ error: 'Only actively borrowed items can be marked as returned' });
      return;
    }

    transaction.status = 'returned';
    transaction.returnedAt = new Date();

    if (typeof authReq.body.lenderRating === 'number') {
      transaction.lenderRating = Math.min(5, Math.max(1, authReq.body.lenderRating));
    }
    if (typeof authReq.body.borrowerRating === 'number') {
      transaction.borrowerRating = Math.min(5, Math.max(1, authReq.body.borrowerRating));
    }

    await transaction.save();

    // Atomically reset item back to available for the next borrower
    await Item.findByIdAndUpdate(transaction.item, { $set: { status: 'available' } });

    // Increment borrower returns counter
    await User.findByIdAndUpdate(transaction.borrower, { $inc: { totalReturns: 1 } });

    const populated = await Transaction.findById(transaction._id)
      .populate('item', 'title category status')
      .populate('borrower', 'name email is_verified')
      .populate('lender', 'name email is_verified');

    res.json(populated);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to record return' });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/transactions/:id/reject
 * Lender rejects borrow request
 * ───────────────────────────────────────────── */
router.put('/:id/reject', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    if (transaction.lender.toString() !== authReq.userId) {
      res.status(403).json({ error: 'Only the item owner can reject borrow requests' });
      return;
    }

    if (transaction.status !== 'pending') {
      res.status(400).json({ error: `Cannot reject a request with status "${transaction.status}"` });
      return;
    }

    transaction.status = 'rejected';
    transaction.rejectedAt = new Date();
    await transaction.save();

    // Revert item back to available
    await Item.findByIdAndUpdate(transaction.item, { $set: { status: 'available' } });

    res.json(transaction);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to reject request' });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/transactions/:id/cancel
 * Borrower cancels pending or approved request
 * ───────────────────────────────────────────── */
router.put('/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    if (transaction.borrower.toString() !== authReq.userId) {
      res.status(403).json({ error: 'Only the borrowing requester can cancel this request' });
      return;
    }

    if (!['pending', 'approved'].includes(transaction.status)) {
      res.status(400).json({ error: `Cannot cancel an item with status "${transaction.status}"` });
      return;
    }

    transaction.status = 'cancelled';
    transaction.cancelledAt = new Date();
    await transaction.save();

    // Revert item back to available
    await Item.findByIdAndUpdate(transaction.item, { $set: { status: 'available' } });

    res.json(transaction);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to cancel request' });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/transactions
 * Retrieve transactions for current user (borrower or lender)
 * Query: ?role=borrower|lender&status=pending,active
 * ───────────────────────────────────────────── */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { role, status } = authReq.query;
    const userId = authReq.userId;

    const filter: Record<string, unknown> = {};

    if (role === 'borrower') {
      filter.borrower = userId;
    } else if (role === 'lender') {
      filter.lender = userId;
    } else {
      filter.$or = [{ borrower: userId }, { lender: userId }];
    }

    if (typeof status === 'string' && status.trim()) {
      filter.status = { $in: status.split(',').map((s) => s.trim()) };
    }

    const transactions = await Transaction.find(filter)
      .populate('item', 'title category status ownerEmail maxBorrowTime is_verified')
      .populate('borrower', 'name email is_verified communityScore')
      .populate('lender', 'name email is_verified communityScore')
      .sort('-createdAt');

    res.json(transactions);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve transactions' });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/transactions/:id
 * Retrieve a specific transaction details
 * ───────────────────────────────────────────── */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const transaction = await Transaction.findById(authReq.params.id)
      .populate('item')
      .populate('borrower', 'name email is_verified communityScore')
      .populate('lender', 'name email is_verified communityScore');

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const userId = authReq.userId;
    const isParticipant =
      (transaction.borrower as { _id?: { toString(): string } })._id?.toString() === userId ||
      (transaction.lender as { _id?: { toString(): string } })._id?.toString() === userId;

    if (!isParticipant) {
      res.status(403).json({ error: 'Access denied: You are not a party in this transaction' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve transaction details' });
  }
});

export default router;
