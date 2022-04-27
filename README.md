
## Descrição

Teste para vaga de desenvolvedor de software Onfly.

Author: Vitor Ramalho Vilela.

## Recursos utilizados

[Nest](https://github.com/nestjs/nest) Framework NodeJs utilizado para construção da API.
<br />
[Docker](https://docs.docker.com/compose/) Ferramenta utilizada para armazenamento e do banco de dados
<br />
[Prisma](https://www.prisma.io/docs/) ORM utilizado para criação do banco de dados. 
<br />
[Jest](https://jestjs.io/docs/next/getting-started) | [Pactum](https://pactumjs.github.io/) Ferramenta utilizada para teste e2e

## Instalação

Todos os scripts estão mapeados no arquivo package.json.

```bash
$ yarn
```
Após a instalação dos pacotes, precisamos subir o banco de dados utilizando o docker, com o seguinte comando:

```bash
$ yarn db:dev:up
```

Obs: Os arquivos .env foram propositalmente enviados com as credenciais. 

## Rodando a aplicação

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

```

## Test

```bash

# e2e tests
$ yarn test:e2e

```

