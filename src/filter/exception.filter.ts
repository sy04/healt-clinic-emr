import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    const ctxType = host.getType<GqlContextType>();

    if (ctxType === 'http') {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
      const statusCode =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const errorResponse = {
        meta: {
          code: statusCode,
          success: false,
          message: exception.message || 'Internal server error',
        },
      };

      this.logger.log(
        {
          method: request.method,
          url: request.url,
          headers: request.headers,
        },
        'Request Details',
      );

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(exception.message, exception.stack);
      } else {
        this.logger.warn(exception.message);
      }

      return response.status(statusCode).json(errorResponse);
    } else if (ctxType === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      gqlHost.getContext();

      this.logger.error(exception.message, exception.stack);

      return {
        meta: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: exception.message || 'Internal server error',
        },
      };
    } else {
      this.logger.error(exception.message, exception.stack);
    }
  }
}
