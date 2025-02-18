
import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        if (exception instanceof HttpException) {
            if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    path: request.url,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    timestamp: new Date().toISOString(),
                    message: exception.message,
                    stack: exception.stack,
                    data: exception.getResponse(),
                });
            }
        } else {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                path: request.url,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
                message: exception['message'],
                stack: exception['stack'],
                data: {
                    code: exception[`code`],
                    message: exception[`message`],
                    status: exception[`status`],
                    statusCode: exception[`response`]?.status,
                    response: exception[`response`]?.data,
                    requestUrl: exception[`config`]?.url,
                    requestBody:
                        exception[`config`]?.data && JSON.parse(exception[`config`].data),
                }
            });
        }


        super.catch(exception, host);
    }
}