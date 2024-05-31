import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @IsString()
  @ApiProperty({
    description: 'email',
    example: 'mrossi@email.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'First name',
    example: 'Mario',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Last name',
    example: 'Rossi',
  })
  lastName: string;
}
