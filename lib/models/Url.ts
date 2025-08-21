import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUrl extends Document {
  _id: string;
  shortCode: string;
  longUrl: string;
  title?: string;
  description?: string;
  customSlug?: string;
  isActive: boolean;
  clicks: number;
  expiresAt?: Date;
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    customSlug: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
urlSchema.index({ shortCode: 1 });
urlSchema.index({ userId: 1 });
urlSchema.index({ createdAt: -1 });
urlSchema.index({ expiresAt: 1 });

export default mongoose.models.Url || mongoose.model<IUrl>('Url', urlSchema);
