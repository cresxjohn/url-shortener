import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClick extends Document {
  _id: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  urlId: Types.ObjectId;
}

const clickSchema = new Schema<IClick>(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    referrer: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    device: {
      type: String,
      required: false,
    },
    browser: {
      type: String,
      required: false,
    },
    os: {
      type: String,
      required: false,
    },
    urlId: {
      type: Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
    },
  },
  {
    timestamps: false, // We're using timestamp field instead
  }
);

// Create indexes
clickSchema.index({ urlId: 1 });
clickSchema.index({ timestamp: -1 });

export default mongoose.models.Click ||
  mongoose.model<IClick>('Click', clickSchema);
