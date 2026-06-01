import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Никогда не отдаём passwordHash наружу
const safeSelect = { id: true, login: true, role: true };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: safeSelect,
      orderBy: { id: 'asc' },
    });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.user.create({
        data: { login: dto.login, passwordHash, role: dto.role as Role },
        select: safeSelect,
      });
    } catch {
      throw new ConflictException('Логин уже занят');
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: {
      login?: string;
      role?: Role;
      passwordHash?: string;
    } = {};
    if (dto.login !== undefined) data.login = dto.login;
    if (dto.role !== undefined) data.role = dto.role as Role;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data, select: safeSelect });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id }, select: safeSelect });
  }

  private async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }
}
