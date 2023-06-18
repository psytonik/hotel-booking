import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './users.model';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
        collection: 'Users',
      },
    ]),
    IamModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
