import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../conversations/entities/conversation.entity';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { JwtPayload, RequestWithUser } from 'src/interfaces/jwt.payload.interfaces';


@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>) {}

  async create(createconversationDto: CreateConversationDto): Promise<Conversation> {
    

    const lowercaseConversationDto: CreateConversationDto = {
      userSent: createconversationDto.userSent.toLowerCase(),
      userReceived: createconversationDto.userReceived.toLowerCase(),
      message: createconversationDto.message,
      important: createconversationDto.important
    };
    const createdConversation = new this.conversationModel(lowercaseConversationDto);
    return createdConversation.save();
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async findMessagesBetweenUsers(user1Email: string, user2Email: string): Promise<Conversation[]> {
    const query = {
      $or: [
        { userSent: user1Email, userReceived: user2Email },
        { userSent: user2Email, userReceived: user1Email },
      ],
    };
    return this.conversationModel.find(query).exec();
  }

  async findImportantMessages(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ userSent: userId, important: true }).exec();
  }
  
}
