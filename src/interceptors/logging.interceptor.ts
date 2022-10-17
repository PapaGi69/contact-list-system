import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    if (req.originalUrl.includes('/ate/health')) {
      return next.handle();
    } else {
      this.logger.log(`[ACCESS] ${req.method} ${req.originalUrl}`);

      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `${res.req.method} ${res.req.originalUrl} - Response Code: ${res.statusCode}`,
            ),
          ),
        );
    }
  }
}
