import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Требует валидный JWT в заголовке Authorization: Bearer <token>. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
