import mongoose from "mongoose";

interface PostAttrs {
  userId: string;
  comments?: mongoose.Schema.Types.Array;
  likes?: mongoose.Schema.Types.Number;
}

interface PostDoc extends mongoose.Document {
  userId: string;
  comments: mongoose.Schema.Types.Array;
  likes: mongoose.Schema.Types.Number;
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
    comments: {
      type: mongoose.Schema.Types.Array,
      required: false,
    },
    likes: {
      type: mongoose.Schema.Types.Number,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };
