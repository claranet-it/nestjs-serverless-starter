import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsString()
  @ApiProperty({
    description: 'Username',
    example: 'mrossi',
  })
  username: string;

  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'Asdf1234!!',
  })
  password: string;
}
