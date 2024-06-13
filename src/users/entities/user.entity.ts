import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {

  
  @Prop({ required: true})
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true})
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: true })
  isActive: boolean;
  
  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: Date, default: null })
  blockedUntil: Date;

  @Prop({ default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
