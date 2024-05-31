import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'mrossi@email.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'First name of the user',
    example: 'Mario',
  })
  firstname: string;

  @IsString()
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Rossi',
  })
  lastname: string;

  @IsString()
  @MinLength(8)
  @Matches(/[a-z]/)
  @Matches(/[A-Z]/)
  @Matches(/[0-9]/)
  @ApiProperty({
    description: 'Password of the user',
    example: 'Asdf1234!!',
  })
  password: string;
}
