import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MessageChat extends Document {

  @Prop({ type: String, ref: 'User', required: true })
  userSent: string;

  @Prop({ required: true, ref: 'Chat'})
  chatName: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  important: boolean;

}

export const ChatSchema = SchemaFactory.createForClass(MessageChat);


