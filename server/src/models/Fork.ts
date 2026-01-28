import mongoose, { Document, Schema } from 'mongoose';

export interface IFork extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  sourceRepository: mongoose.Types.ObjectId;
  forkedRepository: mongoose.Types.ObjectId;
  createdAt: Date;
}

const forkSchema = new Schema<IFork>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceRepository: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
    forkedRepository: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index
forkSchema.index({ user: 1, sourceRepository: 1 }, { unique: true });
forkSchema.index({ sourceRepository: 1 });
forkSchema.index({ forkedRepository: 1 });
forkSchema.index({ user: 1 });
forkSchema.index({ createdAt: -1 });

const Fork = mongoose.model<IFork>('Fork', forkSchema);

export default Fork;
