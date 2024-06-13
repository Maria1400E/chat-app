import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Conversation extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userSent: string;

  @Prop({ type: String, ref: 'User', required: true })
  userReceived: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  important: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
