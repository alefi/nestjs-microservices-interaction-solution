import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { exceptionHandler } from './exception.handler';
import { Exception } from './typings';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(catchError((exception: Exception) => exceptionHandler(ctx, exception)));
  }
}
