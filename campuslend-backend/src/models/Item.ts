import mongoose, { Document, Schema, Types } from 'mongoose';

/* ── Types ── */
export type ItemStatus = 'available' | 'reserved' | 'active';

export const ITEM_CATEGORIES = [
  'Electronics',
  'Books',
  'Sports',
  'Musical Instruments',
  'Tools',
  'Furniture',
  'Games',
  'Other',
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export interface IItem {
  title: string;
  description: string;
  category: ItemCategory;
  ownerEmail: string;
  owner?: Types.ObjectId;
  maxBorrowTime: string;
  status: ItemStatus;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemPublic {
  id: string;
  _id: string;
  title: string;
  description: string;
  category: ItemCategory;
  ownerEmail: string;
  owner?: string;
  maxBorrowTime: string;
  status: ItemStatus;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemDocument extends IItem, Document {}

/* ── Schema ── */
const itemSchema = new Schema<IItemDocument>(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ITEM_CATEGORIES,
        message: 'Category "{VALUE}" is not a recognized category',
      },
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    maxBorrowTime: {
      type: String,
      required: [true, 'Maximum borrow time is required'],
      trim: true,
      maxlength: [100, 'Maximum borrow time cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'reserved', 'active'],
        message: 'Status "{VALUE}" is invalid',
      },
      default: 'available',
      index: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

/* ── Compound & Text Indexes for 300ms Debounced Search & Filtering ── */
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ ownerEmail: 1, status: 1 });
itemSchema.index({ createdAt: -1 });

/* ── Pre-save: Auto-verify listing if owner email belongs to recognized university ── */
itemSchema.pre<IItemDocument>('save', function (next) {
  if (this.isModified('ownerEmail')) {
    const emailDomain = this.ownerEmail.split('@')[1]?.toLowerCase() || '';
    const universityDomains = ['.edu', '.ac.', 'hhu.de', 'uni-', '.university'];
    this.is_verified = universityDomains.some((d) => emailDomain.includes(d));
  }
  next();
});

const Item = mongoose.model<IItemDocument>('Item', itemSchema);
export default Item;
