import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from '../prisma-service-config/prisma.service';
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    //dependências injetadas na classe
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ) { }
    async register(dto: AuthDto) {
        //gerar o hash da senha do usuário
        const hash = await argon.hash(dto.password);

        try{
            //salvar usuário no banco de dados
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });
    
            return this.signToken(user.id, user.email);
        } catch(error){
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials Taken')
                }
            }
            throw error;
        }

    }

    async login(dto: AuthDto) {
        //busca usuário pelo e-mail
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        })

        //retorna erro caso o usuário não seja encontrado
        if (!user) throw new ForbiddenException('Usuário não encontrado');

        //verifica senha informada com hash gerado
        const verifyPassword = await argon.verify(user.hash, dto.password);

        //retorna erro caso a senha esteja incorreta
        if (!verifyPassword) throw new ForbiddenException('Senha Incorreta');

        return this.signToken(user.id, user.email)

    }

    //assina o token gerado com as informações do usuário e senha da aplicação
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload,{secret: secret});

        return {
            access_token: token,
        }
    }
}
