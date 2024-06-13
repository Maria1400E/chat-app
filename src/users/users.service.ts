import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }
  

  private handleError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException (error.message);
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({
      _id: { $in: userIds },
    });
  }

  async update(user: User): Promise<User> {
    return user.save();
  }
}
