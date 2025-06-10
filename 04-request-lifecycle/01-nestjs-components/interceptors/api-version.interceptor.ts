import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      map((data) => {
        const executionTime = `${Date.now() - start}ms`;
        return {
          ...data,
          apiVersion: "1.0",
          executionTime,
        };
      }),
    );
  }
}