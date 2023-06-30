import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response, Request, NextFunction } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const { httpAdapter } = this.httpAdapterHost;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const { method, originalUrl } = request;
    const realIp = request.ips.length ? request.ips[0] : request.ip;

    this.logger.error(
      JSON.stringify({
        req: {
          method: method,
          url: originalUrl,
          ip: realIp,
          headers: request.headers,
          query: request.query,
          body: request.body,
        },
        res: {
          status: httpStatus,
          message: exception.message,
          name: exception.name,
          body: exception.getResponse(),
        },
        error: exception.message,
      }),
      exception.stack,
    );

    response.status(httpStatus).json(exception.getResponse());
  }
}
