import { ArgumentsHost, ExceptionFilter, Catch, HttpException } from "@nestjs/common";
import * as fs from "fs";
import { Response } from "express";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || "Unknown error";
    const timestamp = new Date().toISOString();

    const logMessage = `[${timestamp}] ${status} - ${message}\n`;
    fs.appendFileSync("errors.log", logMessage);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp,
    });
  }
}