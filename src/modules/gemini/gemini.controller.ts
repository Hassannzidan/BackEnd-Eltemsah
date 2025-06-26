// src/gemini/gemini.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const reply = await this.geminiService.askGemini(message);
    return { reply };
  }
}
