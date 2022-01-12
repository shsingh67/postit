import { Subjects } from "./subject";

export interface CommentCreatedEvent {
  subject: Subjects.CommentCreated;
  data: {
    id: string;
    userId: string;
    postId: string;
    caption: string;
    likes: number;
  };
}
