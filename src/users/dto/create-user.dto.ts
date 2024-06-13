import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

  @IsString()
  username: string;

  
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número'
  })
  password: string


  @IsString()
  @IsEmail() 
  email: string;
}
