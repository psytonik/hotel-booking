import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../../users/users.model';
import { Model } from 'mongoose';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async generateSecret(email: string) {
    const secret: string = authenticator.generateSecret();
    const appName: string =
      this.configService.getOrThrow<string>('TFA_APP_NAME');
    const uri = authenticator.keyuri(email, appName, secret);
    return {
      uri,
      secret,
    };
  }
  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }
  async enableTfaForUser(email: string, secret: string) {
    const { id } = await this.userModel.findOne({ email });
    await this.userModel
      .findByIdAndUpdate(id, {
        $set: { tfaSecret: secret, isTfaEnabled: true },
      })
      .exec();
  }
}
