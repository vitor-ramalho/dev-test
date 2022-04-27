import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ExpendituresService } from './expenditures.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateExpenditureDto, EditExpenditureDto } from './dto';
import { Request } from 'express';

@Controller('despesas')
export class ExpendituresController {
  constructor(private expenditureService: ExpendituresService) { }
  @Get()
  getExpenditures(
    @GetUser() userId: number,
  ) {
    return this.expenditureService.getExpenditures(
      userId,
    );
  }

  @Get(':id')
  getExpenditureById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) expenditureId: number,
  ) {
    return this.expenditureService.getExpenditureById(
      userId,
      expenditureId,
    )
  }

  @Post()
  createExpenditure(
    @GetUser('id') userId: number,
    @Body() dto: CreateExpenditureDto,
  ) {
    return this.expenditureService.createExpenditure(
      userId,
      dto,
    )
  }

  @Patch(':id')
  editExpenditureById(
    @GetUser('id') userId: number,
    @Body() dto: EditExpenditureDto,
    @Param('id', ParseIntPipe) expenditureId: number
  ) {
    return this.expenditureService.editExpenditureById(
      userId,
      expenditureId,
      dto,
    )
  }

  @Delete()
  deleteExpenditure(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) expenditureId: number
  ) {
    return this.expenditureService.deleteExpenditure(
      userId,
      expenditureId
    )
  }
  
}
