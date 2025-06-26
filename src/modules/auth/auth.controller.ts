import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.validateUser(body.email, body.password);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { code: string }) {
    return await this.authService.verifyFixedCode(body.code);
  }
}

