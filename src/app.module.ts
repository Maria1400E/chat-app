import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { MessageChatModule } from './message-chat/message-chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/project-chat-app'), 
    UserModule, 
    ConversationsModule, 
    ChatsModule, 
    AuthModule, MessageChatModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}