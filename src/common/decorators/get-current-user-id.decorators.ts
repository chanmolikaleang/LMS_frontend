import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (request) {
      return request.user.sub;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const gqlRequest = gqlContext.getContext().req;

    if (gqlRequest) {
      return gqlRequest.user.sub;
    }

    throw new Error('Unable to retrieve user ID from execution context.');
  },
);
