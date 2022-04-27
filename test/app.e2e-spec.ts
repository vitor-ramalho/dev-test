import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma-service-config/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';
import { CreateExpenditureDto, EditExpenditureDto } from 'src/expenditures/dto';

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(() => {
    app.close();
  })
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vitor@gmail.com',
      password: '123'
    }
    describe('Register', () => {
      it('show throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .expectStatus(400)
          .inspect()
      });
      it('show throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
          .inspect()
      });
      it('show throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
          .inspect()
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201)
          .inspect()
      });
    });
    describe('Login', () => {
      it('show throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(400)
          .inspect()
      });
      it('show throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
          .inspect()
      });
      it('show throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
          .inspect()
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      })
    });
  });
  describe('Expenditure', () => {
    describe('Get expenditure', () => {
      it('should get expenditure', () => {
        return pactum
          .spec()
          .get('/despesas')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .inspect()
      });
    });

    describe('Create expenditure', () => {
      const dto: CreateExpenditureDto = {
        description: "Essa é a descrição de uma despesa",
        date: "2021-12-17T03:24:00",
        value: 12,
      }
      it('should create expenditure', () => {
        return pactum
          .spec()
          .post('/despesas')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('expenditureId', 'id')
      });
    });

    describe('Get expenditure by Id', () => {
      it('should get expenditure byID', () => {
        return pactum
          .spec()
          .get('/despesas/{id}')
          .withPathParams('id', '$S{expenditureId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(201)
          .inspect()
      });
    });

    describe('Edit expenditure', () => {
      const dto: EditExpenditureDto = {
        description: "Essa é a descrição de uma despesa",
        date: "2021-12-17T03:24:00",
        value: 12,
      }
      it('should edit expenditure', () => {
        return pactum
          .spec()
          .patch('/despesas/{id}')
          .withPathParams('id', '$S{expenditureId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .inspect()
      });
    });
    describe('Delete expenditure', () => {
      it('should delete expenditure', () => {
        return pactum
          .spec()
          .delete('/despesas/{id}')
          .withPathParams('id', '$S{expenditureId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .inspect()
      });
    });
  });
})