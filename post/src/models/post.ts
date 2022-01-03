import mongoose from "mongoose";
import { CommentDoc } from "./comment";

interface PostAttrs {
  userId: string;
  caption: string;
  imgUrl?: string | undefined;
  comments?: CommentDoc[] | undefined;
  likes?: number | undefined;
}

interface PostDoc extends mongoose.Document {
  userId: string;
  caption: string;
  imgUrl?: string | undefined;
  comments?: CommentDoc[] | undefined;
  likes?: number | undefined;
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
      require: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: {
      type: Number,
      require: false,
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
