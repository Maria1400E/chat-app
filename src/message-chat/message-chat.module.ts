import { Module } from '@nestjs/common';
import { MessageChatService } from './message-chat.service';
import { MessageChatController } from './message-chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema, MessageChat } from './entities/message-chat.entity';
import { UserModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: MessageChat.name, schema: ChatSchema }]),
    UserModule,
    ChatsModule
  ],
  controllers: [MessageChatController],
  providers: [MessageChatService],
})
export class MessageChatModule {}
