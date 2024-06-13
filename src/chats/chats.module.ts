import { Module } from '@nestjs/common';
import { ChatsService } from '../chats/chats.service';
import { ChatsController } from '../chats/chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../chats/entities/chat.entity';
import { UserModule } from 'src/users/users.module';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UserModule
  ],
  exports: [ChatsService, MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])]
})

export class ChatsModule {}
