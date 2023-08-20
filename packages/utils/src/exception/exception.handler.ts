import { ExecutionContext, UnprocessableEntityException } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';

import { getExceptionFactory } from './exception.factory';
import { Exception } from './typings';

export const exceptionHandler = (
  ctx: ExecutionContext,
  incomingException: Exception | UnprocessableEntityException,
): Observable<Exception> => {
  if (!(incomingException instanceof UnprocessableEntityException)) {
    return of(incomingException);
  }

  // Here is the place for additional filtering of business exceptions.

  const exceptionFactory = getExceptionFactory(ctx);
  const outgoingException = exceptionFactory(incomingException);

  return throwError(() => outgoingException);
};
