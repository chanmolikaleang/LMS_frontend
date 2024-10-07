import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (request) {
      if (!data) return request.user;
      return request.user[data];
    }

    const httpContext = context.switchToHttp();
    const httpRequest = httpContext.getRequest();

    if (httpRequest) {
      if (!data) return httpRequest.user;
      return httpRequest.user[data];
    }

    throw new Error('Unable to retrieve user from execution context.');
  },
);
