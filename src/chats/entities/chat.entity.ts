import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Chat extends Document {

  @Prop({ required: true, unique: true})
  chatName: string;

  @Prop({ type: [{ type: User }], default: [] })
  users: User[];

  @Prop({ default: Date.now })
  createdAt: Date;
  
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

