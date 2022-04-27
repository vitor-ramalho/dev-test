import { IsDateString, IsNumber, IsPositive, MaxDate, MaxLength, MinLength } from 'class-validator';

export class CreateExpenditureDto {
   
    @MinLength(1)
    @MaxLength(191)
    description: string;

    @IsDateString()
    date: string;

    @IsNumber()
    @IsPositive()
    value: number
}
