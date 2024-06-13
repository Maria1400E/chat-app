import { Controller, Post, Body, UseGuards, Req, Get, Param, ForbiddenException, Query } from '@nestjs/common';
import { MessageChatService } from './message-chat.service';
import { BlockUserDto, CreateMessageChatDto } from './dto/create-message-chat.dto';
import { JwtAuthGuard } from 'src/users/userGuard/jwt-user.guard';
import { RequestWithUser } from 'src/interfaces/jwt.payload.interfaces';
import { ChatsService } from 'src/chats/chats.service';

@Controller('message-chat')
export class MessageChatController {
  constructor(private readonly messageChatService: MessageChatService,
    private readonly chatsService: ChatsService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createMessageChat(@Req() req: RequestWithUser, @Body() createMessageChatDto: CreateMessageChatDto) {
    const userSent = req.user.email;
    return this.messageChatService.createMessage(createMessageChatDto, userSent);
  }

  @Get('important')
  @UseGuards(JwtAuthGuard)
  async getImportantMessages(@Req() req: RequestWithUser) {
    const userEmail = req.user.email;
    return this.messageChatService.getImportantMessages(userEmail);
  }

  @Post('block')
  @UseGuards(JwtAuthGuard)
  async blockUser(@Req() req: RequestWithUser, @Body() blockUserDto: BlockUserDto) {
    const adminEmail = req.user.email;
    return this.chatsService.blockUser(adminEmail, blockUserDto.userEmail, blockUserDto.chatName, blockUserDto.blockDuration);
  }
  
  @Get(':groupId')
  @UseGuards(JwtAuthGuard)
  async getGroupMessages(@Param('groupId') groupId: string, @Req() req: RequestWithUser) {
    const userSent = req.user.email;
    
    const userBelongsToGroup = await this.chatsService.isUserMemberOfChat(userSent, groupId);
    if (!userBelongsToGroup) {
      throw new ForbiddenException('El usuario no tiene permiso para ver mensajes de este grupo.');
    }

    return this.messageChatService.getGroupMessages(groupId);
  }
}

