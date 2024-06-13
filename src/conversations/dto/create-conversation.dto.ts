import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateConversationDto {


    userSent: string;

    @IsNotEmpty()
    @IsString()
    userReceived: string; 

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsBoolean()
    important?: boolean;
}
