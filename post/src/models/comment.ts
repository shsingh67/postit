import mongoose from "mongoose";

interface CommentAttrs {
  userId: string;
  postId: string;
  caption: string;
  likes?: number;
}

interface CommentDoc extends mongoose.Document {
  userId: string;
  postId: string;
  caption: string;
  likes?: number;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
  },
});

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment, CommentDoc };
