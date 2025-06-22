import { Injectable, UnauthorizedException } from '@nestjs/common';
import { USERS } from './constants/users';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private otpMap = new Map<string, string>(); // email => otp
  private jwtSecret = 'your_jwt_secret';

  async login(email: string, password: string) {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    this.otpMap.set(email, otp);

    // await this.sendOtpToEmail(email, otp);
    console.log(`✅ OTP sent to ${email}: ${otp}`); // ✅

    return { message: 'OTP sent to email' };
  }

  verifyOtp(email: string, otp: string) {
    const validOtp = this.otpMap.get(email);
    if (!validOtp || validOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    this.otpMap.delete(email);
    const token = jwt.sign({ email }, this.jwtSecret, { expiresIn: '1h' });
    return { access_token: token };
  }

  private async sendOtpToEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hzidan014@gmail.com',
        pass: '1234567', 
      },
    });

    await transporter.sendMail({
      from: '"TEMSAAH" <hzidan014@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });
  }
}
