import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequestDto {
  @IsString()
  @ApiProperty({
    description: 'Refresh Token',
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  refreshToken: string;
}
