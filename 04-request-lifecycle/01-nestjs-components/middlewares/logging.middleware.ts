import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[${method}] ${originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    res.on('error', (err) => {
      const ms = Date.now() - startTime;
      console.error(
        `[${method}] ${originalUrl} → ERROR [${ms}ms]`,
        err.stack,
      );
    });

    try {
      next();
    } catch (err) {
      console.error(
        `[${method}] ${originalUrl} → EXCEPTION во время next():`,
        err instanceof Error ? err.stack : JSON.stringify(err),
      );
      next(err);
    }
  }
}