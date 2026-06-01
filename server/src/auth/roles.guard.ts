import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/** Проверяет, что роль пользователя входит в список, заданный @Roles(...). */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Маршрут без @Roles доступен любому авторизованному пользователю
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user && required.includes(user.role)) return true;

    throw new ForbiddenException('Недостаточно прав');
  }
}
