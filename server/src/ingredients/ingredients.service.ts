import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.ingredient.findMany({
      where: search ? { name: { contains: search } } : undefined,
      include: { employee: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!ingredient) throw new NotFoundException('Ингредиент не найден');
    return ingredient;
  }

  create(dto: CreateIngredientDto) {
    return this.prisma.ingredient.create({ data: dto });
  }

  async update(id: number, dto: UpdateIngredientDto) {
    await this.findOne(id);
    return this.prisma.ingredient.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ingredient.delete({ where: { id } });
  }
}
