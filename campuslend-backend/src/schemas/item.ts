import { z } from 'zod';
import { ITEM_CATEGORIES } from '../models/Item';

const itemStatusSchema = z.enum(['available', 'reserved', 'active']);

const itemFields = {
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(2000),
  category: z.enum(ITEM_CATEGORIES),
  ownerEmail: z.string().trim().email(),
  maxBorrowTime: z.string().trim().min(1).max(100),
};

export const itemCreateSchema = z.object({
  ...itemFields,
  status: itemStatusSchema.default('available'),
});

export const itemUpdateSchema = z
  .object({
    title: itemFields.title.optional(),
    description: itemFields.description.optional(),
    category: itemFields.category.optional(),
    maxBorrowTime: itemFields.maxBorrowTime.optional(),
    status: itemStatusSchema.optional(),
  })
  .refine((item) => Object.keys(item).length > 0, { message: 'At least one field is required' });
