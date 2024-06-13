import { IsString, IsOptional, IsArray, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class CreateChatDto {
  @IsString()
  chatName: string;

  @IsArray()
  @Type(() => User)
  users: User[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  creatorUserId: string;
}

