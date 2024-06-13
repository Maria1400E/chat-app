import { Controller, Post, Body, UseGuards, Request, Delete, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/users/userGuard/jwt-user.guard';
import { RequestWithUser } from 'src/interfaces/jwt.payload.interfaces';



@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {} 

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() { chatName, users }: { chatName: string, users: string[] }, @Request() req) {
    const userEmail = req.user.email; 
    const createChatDto = { chatName, users };
    return this.chatsService.create(createChatDto, userEmail);
  }

  @Post('add-member')
  @UseGuards(JwtAuthGuard)
  async addMember(@Body() { memberEmail, chatName }: { memberEmail: string, chatName: string }, @Request() request: RequestWithUser) {
    const adminEmail = request.user.email;
    return this.chatsService.addMember(adminEmail, memberEmail, chatName);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@Req() req: RequestWithUser, @Body() deleteMemberData: any) {
    const adminEmail = req.user.email;
    const { memberEmail, chatName } = deleteMemberData;
    console.log(`Admin Email: ${adminEmail}, Member Email: ${memberEmail}, Chat Name: ${chatName}`); // log the inputs
    return this.chatsService.deleteMember(adminEmail, memberEmail, chatName);
  }
}

