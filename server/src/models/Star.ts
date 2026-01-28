import mongoose, { Document, Schema } from 'mongoose';

export interface IStar extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  repository: mongoose.Types.ObjectId;
  createdAt: Date;
}

const starSchema = new Schema<IStar>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index to prevent duplicate stars
starSchema.index({ user: 1, repository: 1 }, { unique: true });
starSchema.index({ repository: 1 });
starSchema.index({ user: 1 });
starSchema.index({ createdAt: -1 });

const Star = mongoose.model<IStar>('Star', starSchema);

export default Star;
