import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ExpendituresModule } from './expenditures/expenditures.module';
import { PrismaModule } from './prisma-service-config/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    ExpendituresModule,
    PrismaModule
  ],
})
export class AppModule {}
