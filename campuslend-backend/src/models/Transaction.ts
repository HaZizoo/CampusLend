import mongoose, { Document, Schema, Types } from 'mongoose';

/* ── Types ── */
export type TransactionStatus =
  | 'pending'      // Borrower requested
  | 'approved'     // Lender approved
  | 'active'       // Item picked up
  | 'returned'     // Item returned
  | 'rejected'     // Lender rejected
  | 'cancelled';   // Borrower cancelled

export interface ITransaction {
  item: Types.ObjectId;
  borrower: Types.ObjectId;
  lender: Types.ObjectId;
  status: TransactionStatus;
  requestedAt: Date;
  approvedAt?: Date;
  pickedUpAt?: Date;
  returnedAt?: Date;
  rejectedAt?: Date;
  cancelledAt?: Date;
  borrowDuration: string;
  borrowerRating?: number;
  lenderRating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}

/* ── Schema ── */
const transactionSchema = new Schema<ITransactionDocument>(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item reference is required'],
    },
    borrower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Borrower reference is required'],
      index: true,
    },
    lender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lender reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'active', 'returned', 'rejected', 'cancelled'],
        message: 'Status "{VALUE}" is not a valid transaction status',
      },
      default: 'pending',
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: Date,
    pickedUpAt: Date,
    returnedAt: Date,
    rejectedAt: Date,
    cancelledAt: Date,
    borrowDuration: {
      type: String,
      required: [true, 'Borrow duration is required'],
      trim: true,
    },
    borrowerRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    lenderRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      trim: true,
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

/* ── Compound & Partial Unique Indexes for Absolute Double-Booking Prevention ── */
// At most ONE active/pending/approved transaction may exist for an item across the entire database!
transactionSchema.index(
  { item: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'approved', 'active'] },
    },
  },
);

transactionSchema.index({ borrower: 1, status: 1 });
transactionSchema.index({ lender: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model<ITransactionDocument>('Transaction', transactionSchema);
export default Transaction;
