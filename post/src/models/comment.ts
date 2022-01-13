import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CommentAttrs {
  id: string;
  userId: string;
  postId: string;
  caption: string;
  likes?: number;
}

interface CommentDoc extends mongoose.Document {
  userId: string;
  postId: string;
  caption: string;
  likes: number;
  version: number;
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

commentSchema.set("versionKey", "version");
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Comment.findOne({ _id: event.id, version: event.version - 1 });
};

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment, CommentDoc };
