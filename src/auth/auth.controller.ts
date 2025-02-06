import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import {
  InstructorSignUpDto,
  SignInDto,
  SignUpDto,
  SignUpResponse,
} from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() signUp: SignUpDto): Promise<SignUpResponse> {
    console.log('Email before validation:', signUp.email);
    return this.authService.register(signUp);
  }

  @Public()
  @Post('instructorSignUp')
  instructorSignUp(
    @Body() signUp: InstructorSignUpDto,
  ): Promise<SignUpResponse> {
    console.log('Email before validation:', signUp.email);
    return this.authService.instructorRegister(signUp);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto): Promise<SignUpResponse> {
    return this.authService.login(signInDto);
  }
}
