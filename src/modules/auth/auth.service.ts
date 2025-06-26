import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validateUser(email: string, password: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return { message: 'Verified. Go to verification step' };
  }

  async verifyFixedCode(code: string): Promise<{ token: string }> {
    if (code !== '8d1t') {
      throw new UnauthorizedException('Wrong verification code');
    }

    // مجرد توكن عشان نخزن الجلسة أو ندخل المستخدم على الـ admin
    const token = jwt.sign({ role: 'admin' }, 'SECRET_KEY', { expiresIn: '2h' });
    return { token };
  }
}

