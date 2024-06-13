import { IsBoolean, IsNotEmpty, IsString, IsOptional, IsUrl, IsEmail, Matches } from "class-validator";

export class CreateMessageChatDto {

    userSent: string;

    @IsNotEmpty()
    @IsString()
    chatName: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsBoolean()
    important?: boolean;
}

export class BlockUserDto {
    @IsEmail()
    @IsNotEmpty()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    chatName: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^(indefinite|\d+(s|m|h|d)?)$/, { message: 'blockDuration must be "indefinite" or a duration string' })
    blockDuration: string;
}
