import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = request.headers['x-role'];
    if (!role || role !== 'admin') {
      throw new ForbiddenException('Доступ запрещён: требуется роль admin');
    }
    return true;
  }
}