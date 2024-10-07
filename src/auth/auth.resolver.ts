import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpResponse, { name: 'signUp' })
  signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.register(signUpDto);
  }

  @Mutation(() => SignUpResponse, { name: 'signIn' })
  signIn(@Args('signInDto') signInDto: SignUpDto): Promise<SignUpResponse> {
    return this.authService.login(signInDto);
  }
}
