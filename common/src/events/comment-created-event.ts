import { Subjects } from "./subject";

export interface TicketCreatedEvent {
  subject: Subjects.CommentCreated;
  data: {
    id: string;
    userId: string;
    postId: string;
    caption: string;
    likes: number;
  };
}
