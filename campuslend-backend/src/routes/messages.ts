import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import Message from '../models/Message';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Enforce authentication across all messaging endpoints
router.use(authenticate);

/* ─────────────────────────────────────────────
 * POST /api/messages
 * Send a message to coordinate an item pickup or return
 * ───────────────────────────────────────────── */
router.post(
  '/',
  validate([
    { field: 'receiverId', required: true, type: 'string' },
    { field: 'content', required: true, type: 'string', minLength: 1, maxLength: 5000 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { receiverId, content, transactionId } = authReq.body;

      if (!Types.ObjectId.isValid(receiverId)) {
        res.status(400).json({ error: 'Invalid recipient user ID format' });
        return;
      }

      if (receiverId === authReq.userId) {
        res.status(400).json({ error: 'Cannot send a message to yourself' });
        return;
      }

      const message = new Message({
        sender: authReq.userId,
        receiver: receiverId,
        content: String(content).trim(),
        transaction: transactionId && Types.ObjectId.isValid(transactionId) ? transactionId : undefined,
      });

      await message.save();

      const populated = await Message.findById(message._id)
        .populate('sender', 'name email is_verified')
        .populate('receiver', 'name email is_verified');

      res.status(201).json(populated);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message || 'Failed to dispatch message' });
    }
  },
);

/* ─────────────────────────────────────────────
 * GET /api/messages/conversations
 * Aggregate conversation list (latest message & unread badge)
 * ───────────────────────────────────────────── */
router.get('/conversations', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userObjectId = new Types.ObjectId(authReq.userId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userObjectId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ['$receiver', userObjectId] }, { $eq: ['$read', false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contact',
        },
      },
      { $unwind: '$contact' },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          unreadCount: 1,
          'contact._id': 1,
          'contact.name': 1,
          'contact.email': 1,
          'contact.is_verified': 1,
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    res.json(conversations);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve conversations' });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/messages/:userId
 * Get message thread with a specific user
 * ───────────────────────────────────────────── */
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const currentUserId = authReq.userId;
    const otherUserId = String(authReq.params.userId);
    const { page, limit } = authReq.query;

    if (!Types.ObjectId.isValid(otherUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const pageNum = Math.max(1, parseInt(typeof page === 'string' ? page : '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(typeof limit === 'string' ? limit : '50', 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('sender', 'name email is_verified')
      .populate('receiver', 'name email is_verified');

    // Automatically mark unread messages from other user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } },
    );

    // Return chronological order for UI display
    res.json(messages.reverse());
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve messages' });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/messages/:id/read
 * Mark a single message as read
 * ───────────────────────────────────────────── */
router.put('/:id/read', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const message = await Message.findOneAndUpdate(
      { _id: authReq.params.id, receiver: authReq.userId },
      { $set: { read: true } },
      { new: true },
    );

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json(message);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to update message status' });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/messages/unread/count
 * Retrieve total unread messages count for badge indicator
 * ───────────────────────────────────────────── */
router.get('/unread/count', async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const count = await Message.countDocuments({
      receiver: authReq.userId,
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to count unread messages' });
  }
});

export default router;
