import { Module } from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { ConversationController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './entities/conversation.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    AuthModule
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  
})

export class ConversationsModule {}
