import mongoose, { Document, Schema, Types } from 'mongoose';

/* ── Types ── */
export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  transaction?: Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {}

/* ── Schema ── */
const messageSchema = new Schema<IMessageDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
      index: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      minlength: [1, 'Message must contain at least 1 character'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
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

/* ── Indexes for high-performance conversation feeds ── */
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1, createdAt: -1 });

const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
export default Message;
