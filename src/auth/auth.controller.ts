import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
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
import { RefreshTokenResponseDto } from './dto/refresh-token.response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';
import JwtAuthGuard from './jwt/jwt.auth.guard';
import { LogoutRequestDto } from './dto/logout.request.dto';

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
    description: 'ID Token, Access token and Refresh token',
    schema: {
      $ref: getSchemaPath(LoginResponseDto),
    },
  })
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh-token')
  @HttpCode(200)
  @ApiExtraModels(RefreshTokenResponseDto)
  @ApiResponse({
    status: 200,
    description: 'ID Token and Access token',
    schema: {
      $ref: getSchemaPath(RefreshTokenResponseDto),
    },
  })
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Revoked refresh token',
  })
  async logout(@Body() { refreshToken }: LogoutRequestDto): Promise<void> {
    return await this.authService.logout(refreshToken);
  }
}
