import { Controller, Post, Body, Get, UseGuards, Req, Param, UnauthorizedException } from '@nestjs/common';
import { ConversationService } from '../conversations/conversations.service';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { JwtAuthGuard } from 'src/users/userGuard/jwt-user.guard';
import { RequestWithUser } from 'src/interfaces/jwt.payload.interfaces';



@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createConversationDto: CreateConversationDto, @Req() req: RequestWithUser) {
    const loggedInUser = req.user;
    createConversationDto.userSent = loggedInUser.email; 
    return this.conversationService.create(createConversationDto);
  }

  @Get('important')
  @UseGuards(JwtAuthGuard)
  async getImportantMessages(@Req() req: RequestWithUser) {
    const userId = req.user.email; 
    return this.conversationService.findImportantMessages(userId);
  }

  @Get('all')
  async findAll() {
    return this.conversationService.findAll();
  }

  @Get(':user2Email')
  @UseGuards(JwtAuthGuard)
  async findMessagesBetweenUsers(@Req() req, @Param('user2Email') user2Email: string) {
  if (!req.user || !req.user.email) {
    throw new UnauthorizedException('No se pudo obtener el correo electrónico del usuario logueado');
  }
  const loggedInUserEmail = req.user.email;
  return this.conversationService.findMessagesBetweenUsers(loggedInUserEmail, user2Email);
  }

}
