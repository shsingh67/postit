import mongoose from "mongoose";

interface CommentAttrs {
  //id: string;
  userId: string;
  caption: string;
  likes?: number;
}

interface CommentDoc extends mongoose.Document {
  userId: string;
  caption: string;
  likes?: number;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema(
  {
    userId: {
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

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment, CommentDoc };
