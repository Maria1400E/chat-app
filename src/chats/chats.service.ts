import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from '../chats/entities/chat.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../users/users.service';
import * as ms from 'ms';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly userService: UserService,
  ) {}

  async create(createChatDto: { chatName: string, users: string[] }, creatorEmail: string): Promise<Chat> {
    const creatorUser = await this.userService.findByEmail(creatorEmail);
    if (!creatorUser) {
      throw new Error('El usuario creador no existe');
    }

    creatorUser.isAdmin = true;
    await creatorUser.save();
    
    const userEmails = createChatDto.users;
    const users = await Promise.all(userEmails.map(email => this.userService.findByEmail(email)));
  
    users.push(creatorUser);
  
    const createdChat = new this.chatModel({
      chatName: createChatDto.chatName,
      users: users, 
      creatorUserId: creatorUser._id,
      isAdmin: true,
    });
    return createdChat.save();
  }

  async isUserMemberOfChat(userEmail: string, chatName: string): Promise<boolean> {
    const chat = await this.chatModel.findOne({ chatName }).populate('users');
    if (!chat) {
      return false;
    }
    return chat.users.some(user => user.email === userEmail);
  }

  async blockUser(adminEmail: string, userEmail: string, chatName: string, blockDuration: string): Promise<User> {
    const chat = await this.chatModel.findOne({ chatName, 'users.email': adminEmail }).exec();
    
    if (!chat) {
      throw new NotFoundException('El chat no existe.');
    }
  
    const adminUser = chat.users.find(user => user.email === adminEmail);
    if (!adminUser || !adminUser.isAdmin) {
      throw new ForbiddenException('El usuario no tiene permisos de administrador en este chat.');
    }
  
    const userToBlock = chat.users.find(user => user.email === userEmail);
    if (!userToBlock) {
      throw new NotFoundException('El usuario a bloquear no es miembro de este chat.');
    }
  
    if (blockDuration === 'indefinite') { 
      userToBlock.blockedUntil = null;
    } else {
      userToBlock.blockedUntil = new Date(Date.now() + ms(blockDuration));
    }

    userToBlock.blocked = true;

    const updatedUser = await this.userService.update(userToBlock);
    console.log(updatedUser.blockedUntil);
    
    return this.userService.update(userToBlock);
  }


  async isUserBlockedInChat(userEmail: string, chatName: string): Promise<boolean> {
    const chat = await this.chatModel.findOne({ chatName }).exec();
    if (!chat) {
      throw new NotFoundException('Chat no encontrado.');
    }
  
    const userInChat = chat.users.find(user => user.email === userEmail);
    if (!userInChat) {
      throw new NotFoundException('Usuario no encontrado en el chat.');
    }
  
    if (userInChat.blockedUntil && userInChat.blockedUntil > new Date()) {
      return true;
    }
  
    if (userInChat.blockedUntil === null) {
      return true;
    }
  
    return false;
  }

  async addMember(adminEmail: string, memberEmail: string, chatName: string): Promise<void> {
    const chat = await this.chatModel.findOne({ chatName, 'users.email': adminEmail }).exec();
    if (!chat) {
      throw new NotFoundException('El chat no existe.');
    }

    const adminUser = chat.users.find(user => user.email === adminEmail);
    if (!adminUser ||!adminUser.isAdmin) {
      throw new ForbiddenException('El usuario no tiene permisos de administrador en este chat.');
    }

    const memberUser = await this.userService.findByEmail(memberEmail);
    if (!memberUser) {
      throw new NotFoundException('El usuario a agregar no existe.');
    }

    if (!chat.users.some(user => user.email === memberEmail)) {
      chat.users.push(memberUser);
      await chat.save();
    }
  }

  async deleteMember(adminEmail: string, memberEmail: string, chatName: string): Promise<void> {
    const chat = await this.chatModel.findOne({ chatName, 'users.email': adminEmail }).exec();

    if (!chat) {
      throw new NotFoundException('El chat no existe.');
    }

    const adminUser = chat.users.find(user => user.email === adminEmail);
    if (!adminUser || !adminUser.isAdmin) {
      throw new ForbiddenException('El usuario no tiene permisos de administrador en este chat.');
    }

    const memberUser = chat.users.find(user => user.email === memberEmail);
    if (!memberUser) {
      console.log('Member not found in chat:', chat);
      throw new NotFoundException('El usuario a eliminar no es miembro de este chat.');
    }

    const memberIndex = chat.users.findIndex(user => user.email === memberEmail);
    console.log('Member index:', memberIndex);

    chat.users.splice(memberIndex, 1);
    await chat.save();
  }
}