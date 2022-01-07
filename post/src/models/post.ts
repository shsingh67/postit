import mongoose from "mongoose";
import { CommentDoc } from "./comment";

interface PostAttrs {
  userId: string;
  caption: string;
  imgUrl?: string;
  comments?: CommentDoc[];
  likes?: number;
}

interface PostDoc extends mongoose.Document {
  userId: string;
  caption: string;
  imgUrl: string;
  comments: CommentDoc[];
  likes: number;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      default: undefined,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };
