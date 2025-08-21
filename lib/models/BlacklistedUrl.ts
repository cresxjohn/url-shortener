import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistedUrl extends Document {
  _id: string;
  url: string;
  reason?: string;
  createdAt: Date;
}

const blacklistedUrlSchema = new Schema<IBlacklistedUrl>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Create indexes
blacklistedUrlSchema.index({ url: 1 });

export default mongoose.models.BlacklistedUrl ||
  mongoose.model<IBlacklistedUrl>('BlacklistedUrl', blacklistedUrlSchema);
