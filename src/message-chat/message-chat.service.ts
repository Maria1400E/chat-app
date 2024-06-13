import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageChatDto } from './dto/create-message-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MessageChat } from './entities/message-chat.entity';
import { Model } from 'mongoose';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { UserService } from '../users/users.service';

@Injectable()
export class MessageChatService {
  constructor(
    @InjectModel(MessageChat.name) private readonly messageChatModel: Model<MessageChat>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly chatService: ChatsService,
    private readonly UserService: UserService
  ) {}

  async createMessage(createMessageChatDto: CreateMessageChatDto, userSent: string, imageUrl?: string): Promise<MessageChat> {
    const user = await this.UserService.findByEmail(userSent);
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }
  
    const isUserBlockedInChat = await this.chatService.isUserBlockedInChat(userSent, createMessageChatDto.chatName);
    if (isUserBlockedInChat) {
      throw new ForbiddenException('El usuario está bloqueado en este chat y no puede enviar mensajes.');
    }
  
    if (user.blocked && (!user.blockedUntil || user.blockedUntil > new Date())) {
      throw new ForbiddenException('El usuario está bloqueado y no puede enviar mensajes.');
    }
  
    const createdMessageChat = new this.messageChatModel({
      chatName: createMessageChatDto.chatName,
      userSent,
      message: createMessageChatDto.message,
      important: createMessageChatDto.important,
    });
  
    return createdMessageChat.save();
  }


  async getGroupMessages(groupId: string): Promise<MessageChat[]> {
    return this.messageChatModel.find({ chatName: groupId }).exec();
  }

  async getImportantMessages(userEmail: string): Promise<MessageChat[]> {
    const userChats = await this.chatModel.find({ 'users.email': userEmail }).exec();
    const chatNames = userChats.map(chat => chat.chatName);
  
    return this.messageChatModel.find({ chatName: { $in: chatNames }, important: true }).exec();
  }
}

