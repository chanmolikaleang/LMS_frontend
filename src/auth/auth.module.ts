import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, AuthService, UserService, AtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
