// src/gemini/gemini.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private readonly API_KEY = process.env.GEMINI_API_KEY;
    private readonly BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  async askGemini(prompt: string): Promise<string> {
    try {
      const res = await axios.post(
        `${this.BASE_URL}?key=${this.API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch (error) {
      console.error('Gemini error:', error.message);
      return 'Sorry, something went wrong!';
    }
  }
}
