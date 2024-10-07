import { Global, Module } from '@nestjs/common';
import { ExceptionHandlerService } from './exception-handler.service';

@Global()
@Module({
  providers: [ExceptionHandlerService],
  exports: [ExceptionHandlerService],
})
export class ExceptionHandlerModule {}
