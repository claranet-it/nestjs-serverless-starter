import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @ApiExtraModels(RegisterRequestDto)
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async signup(@Body() registerRequest: RegisterRequestDto): Promise<void> {
    await this.authService.register(registerRequest);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiExtraModels(LoginResponseDto)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      $ref: getSchemaPath(LoginResponseDto),
    },
  })
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginRequest);
  }
}
