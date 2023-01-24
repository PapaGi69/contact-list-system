import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(Error)
export class InternalServerError implements ExceptionFilter {
  private readonly logger = new Logger(InternalServerError.name);

  catch(exception: Error, host: ArgumentsHost) {
    const status = exception['status'] ?? 500;

    const errorData = {
      message: exception.message,
      error: exception.name,
      status,
      exception: exception,
    };

    this.logger.error(exception, exception.stack);

    return errorData;
  }
}
