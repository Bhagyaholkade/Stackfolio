import mongoose, { Document, Schema } from 'mongoose';

export interface IRepository extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  visibility: 'public' | 'private';
  defaultBranch: string;
  forkedFrom: mongoose.Types.ObjectId | null;
  starCount: number;
  forkCount: number;
  watchCount: number;
  language: string;
  languages: Record<string, number>;
  topics: string[];
  homepage: string;
  hasIssues: boolean;
  hasWiki: boolean;
  hasProjects: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true,
      minlength: [1, 'Repository name must be at least 1 character'],
      maxlength: [100, 'Repository name cannot exceed 100 characters'],
      match: [/^[a-zA-Z0-9._-]+$/, 'Repository name can only contain alphanumeric characters, dots, hyphens, and underscores'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Repository owner is required'],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    defaultBranch: {
      type: String,
      default: 'main',
    },
    forkedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
      default: null,
    },
    starCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    forkCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    watchCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    language: {
      type: String,
      default: '',
    },
    languages: {
      type: Map,
      of: Number,
      default: {},
    },
    topics: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    homepage: {
      type: String,
      trim: true,
      default: '',
    },
    hasIssues: {
      type: Boolean,
      default: true,
    },
    hasWiki: {
      type: Boolean,
      default: false,
    },
    hasProjects: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 0,
      min: 0,
    },
    pushedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique repo name per owner
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

// Other indexes
repositorySchema.index({ owner: 1 });
repositorySchema.index({ visibility: 1 });
repositorySchema.index({ starCount: -1 });
repositorySchema.index({ createdAt: -1 });
repositorySchema.index({ pushedAt: -1 });
repositorySchema.index({ topics: 1 });
repositorySchema.index({ language: 1 });

// Regular index for search (text index removed for MongoDB Atlas compatibility)
repositorySchema.index({ name: 1 });

const Repository = mongoose.model<IRepository>('Repository', repositorySchema);

export default Repository;
