import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Rossi',
  })
  lastName: string;
}
