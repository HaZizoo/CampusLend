import { Router, Request, Response } from 'express';
import Item, { ITEM_CATEGORIES, ItemCategory } from '../models/Item';
import { authenticate, optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

/** Escape characters with special meaning in regex to prevent ReDoS */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/* ─────────────────────────────────────────────
 * GET /api/items
 * Public — supports the 300ms debounced search
 * Query: ?search=calc&category=Electronics&status=available&page=1&limit=20&sort=-createdAt
 * ───────────────────────────────────────────── */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, status, page, limit, sort } = req.query;

    const filter: Record<string, unknown> = {};

    // 300ms Debounced search handling: title & description
    if (typeof search === 'string' && search.trim().length > 0) {
      const sanitized = escapeRegex(search.trim().slice(0, 100));
      filter.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Category filter
    if (typeof category === 'string' && category !== 'All' && ITEM_CATEGORIES.includes(category as ItemCategory)) {
      filter.category = category;
    }

    // Status filter
    if (typeof status === 'string' && ['available', 'reserved', 'active'].includes(status)) {
      filter.status = status;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(typeof page === 'string' ? page : '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(typeof limit === 'string' ? limit : '20', 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortField = typeof sort === 'string' ? sort : '-createdAt';

    const items = await Item.find(filter)
      .sort(sortField)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Map _id to string id for seamless frontend contract compatibility
    const normalized = items.map((item) => ({
      ...item,
      id: item._id.toString(),
    }));

    res.json(normalized);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve inventory items' });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/items/:id
 * Public — retrieve single item details
 * ───────────────────────────────────────────── */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).lean();
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({
      ...item,
      id: item._id.toString(),
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve item' });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/items
 * Create new item listing
 * ───────────────────────────────────────────── */
router.post(
  '/',
  optionalAuth,
  validate([
    { field: 'title', required: true, type: 'string', minLength: 2, maxLength: 200 },
    { field: 'description', required: true, type: 'string', maxLength: 2000 },
    { field: 'category', required: true, type: 'string', enum: ITEM_CATEGORIES },
    { field: 'ownerEmail', required: true, type: 'email' },
    { field: 'maxBorrowTime', required: true, type: 'string', maxLength: 100 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, category, ownerEmail, maxBorrowTime, status } = req.body;

      const item = new Item({
        title: String(title).trim(),
        description: String(description).trim(),
        category,
        ownerEmail: String(ownerEmail).trim().toLowerCase(),
        maxBorrowTime: String(maxBorrowTime).trim(),
        status: status === 'reserved' || status === 'active' ? status : 'available',
        owner: req.userId || undefined,
      });

      await item.save();

      res.status(201).json(item.toJSON());
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message || 'Failed to publish item listing' });
    }
  },
);

/* ─────────────────────────────────────────────
 * PUT /api/items/:id
 * Update an existing item (requires authentication)
 * ───────────────────────────────────────────── */
router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const existing = await Item.findById(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Ownership check: only owner can edit
    if (existing.owner && existing.owner.toString() !== authReq.userId && existing.ownerEmail !== authReq.user.email) {
      res.status(403).json({ error: 'Forbidden: You do not have permission to edit this listing' });
      return;
    }

    const allowedFields = ['title', 'description', 'category', 'maxBorrowTime', 'status'] as const;
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'category' && !ITEM_CATEGORIES.includes(req.body[field])) {
          res.status(400).json({ error: `Invalid category: ${req.body[field]}` });
          return;
        }
        existing.set(field, req.body[field]);
      }
    }

    await existing.save();

    res.json(existing.toJSON());
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to update item listing' });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/items/:id
 * Delete an item listing (Supports frontend API contract: { success: true })
 * ───────────────────────────────────────────── */
router.delete('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found', success: false });
      return;
    }

    // If authenticated, enforce ownership
    if (req.userId && item.owner && item.owner.toString() !== req.userId && item.ownerEmail !== req.user?.email) {
      res.status(403).json({ error: 'Forbidden: You are not authorized to delete this listing', success: false });
      return;
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Item listing removed successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to delete item', success: false });
  }
});

export default router;
