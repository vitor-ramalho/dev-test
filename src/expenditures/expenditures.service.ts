import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service-config/prisma.service';
import { CreateExpenditureDto, EditExpenditureDto } from './dto';

@Injectable()
export class ExpendituresService {
  constructor(
    private prisma: PrismaService,
  ) { }

  getExpenditures(userId: number) {
    console.log(userId);
    return this.prisma.expenditure.findMany({
      where: {
        userId,
      },
    });

  }

  async createExpenditure(
    userId: number,
    dto: CreateExpenditureDto
  ) {
    const expenditure = await this.prisma.expenditure.create({
      data: {
        userId,
        ...dto,
      },
    });

    return expenditure;
  }

  getExpenditureById(
    userId: number,
    expenditureId: number
  ) {
    return this.prisma.expenditure.findFirst({
      where: {
        id: expenditureId,
        userId
      },
    });
  }

  async editExpenditureById(
    userId: number,
    expenditureId: number,
    dto: EditExpenditureDto
  ) {
    const expenditure = await this.prisma.expenditure.findUnique({
      where: {
        id: expenditureId
      }
    })

    if (!expenditure || expenditure.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.prisma.expenditure.update({
      where: {
        id: expenditureId
      },
      data: {
        ...dto
      }
    })

  }

  async deleteExpenditure(
    userId: number,
    expenditureId: number
  ) {
    const expenditure = await this.prisma.expenditure.findUnique({
      where: {
        id: expenditureId
      }
    })

    if (!expenditure || expenditure.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    };

    await this.prisma.expenditure.delete({
      where:{
        id: expenditureId
      }
    })
  }
}
