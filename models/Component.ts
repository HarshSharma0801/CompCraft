import mongoose, { Document, Schema } from "mongoose";

export interface IComponent extends Document {
  _id: string;
  title: string;
  code: string;
  userId: string;
  isPublic: boolean;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ComponentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for efficient querying
ComponentSchema.index({ userId: 1, createdAt: -1 });
ComponentSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.models.Component ||
  mongoose.model<IComponent>("Component", ComponentSchema);
