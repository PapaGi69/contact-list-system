import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = Object(exception.getResponse());

    const errorResponse = {
      ...exceptionResponse,
      path: `${request.method} ${request.url}`,
    };

    // log http exception
    this.logger.error(exception.message, errorResponse, exception.stack);

    response.status(status).json(errorResponse);
  }
}
