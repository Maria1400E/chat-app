import { Injectable, UnauthorizedException } from '@nestjs/common';  
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../auth/dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    const payload = { username: user.username, sub: user._id };
    return {
      email: user.email,
      password: user.password,
      access_token: this.jwtService.sign(payload, {secret: process.env.JWT_SECRET}),
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userModel.findById(payload.sub);
    if (user) {
      return user;
    }
    return null;
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}

