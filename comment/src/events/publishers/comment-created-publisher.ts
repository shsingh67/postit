import {
  Publisher,
  CommentCreatedEvent,
  Subjects,
} from "@singhpostitapp/common";

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent> {
  readonly subject = Subjects.CommentCreated;
}
