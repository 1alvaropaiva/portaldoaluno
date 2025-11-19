# API de Rematrícula – NestJS, JWT, Swagger e Banco de Dados

## Objetivo

Desenvolver uma **API RESTful** utilizando **NestJS**, com **autenticação JWT**, **documentação Swagger** e **persistência de dados** em banco relacional ou não relacional.

O sistema deverá simular o **processo de rematrícula de alunos**, permitindo que cada aluno acesse informações sobre disciplinas e turmas ofertadas e realize sua inscrição, respeitando **pré-requisitos acadêmicos** e **regras de matrícula**.

---

## Descrição Geral do Sistema

A aplicação deverá permitir que **alunos autenticados** consultem as turmas disponíveis no período letivo e realizem sua **rematrícula**.

### Autenticação

A autenticação deverá ocorrer dessa forma:

#### Autenticação Interna (via banco de dados)
- Cadastro e login de aluno armazenado no banco com **senha criptografada**;
- Retorno de um **JWT válido** para as rotas protegidas.

## Modelagem de Dados (Entidades e Relacionamentos)

### Entidades

#### Aluno
- `id`
- `nome`
- `matrícula`
- `email`
- `senha`
- `curso_id` (FK → Curso)

#### Curso
- `id`
- `nome`
- `sigla`

#### Disciplina
- `id`
- `código`
- `nome`
- `carga_horária`
- `curso_id` (FK → Curso)

#### PreRequisito
- `id`
- `disciplina_id`
- `disciplina_requisito_id`

#### Turma
- `id`
- `disciplina_id`
- `professor`
- `horário`
- `período_letivo`

#### MatriculaAluno
- `id`
- `aluno_id`
- `turma_id`
- `situação`
- `data_matrícula`

## Funcionalidades Obrigatórias

### 1. Autenticação e Autorização
- Login via usuário/senha (JWT);
- Rotas protegidas exigindo token JWT.

### 2. Gerenciamento de Dados
- CRUD completo de:
    - Aluno
    - Curso
    - Disciplina
    - Turma
- Associação de pré-requisitos entre disciplinas.

### 3. Rematrícula
- Listagem de turmas disponíveis por período letivo;
- Inscrição do aluno autenticado em uma turma;
- Validação de pré-requisitos antes da matrícula;
- Registro da matrícula com data e situação inicial.

### 4. Listagens
- Turmas por período;
- Disciplinas já cursadas pelo aluno autenticado.

### 5. Documentação
- Toda a API documentada com **Swagger**.

### 6. Banco de Dados
- **Relacional** (PostgreSQL) com **TypeORM**;

---

## Requisitos Técnicos

- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL
- **ORM/ODM:** TypeORM 
- **Autenticação:** JWT
- **Documentação:** Swagger
- **Validação:** class-validator, class-transformer

---

## Estrutura Esperada do Repositório

O repositório deve conter:

- Código-fonte completo;
- Scripts ou migrations;
- Documentação no `README.md`.

---

## Diferenciais (Para Nota Extra)

- Painel administrativo com permissões;
- Uso de **Docker Compose**;
- **Testes automatizados**;
- **Cache com Redis**;
- **Logs e auditoria**.

---

## Sugestão de Tecnologias Complementares

| Área | Ferramenta Recomendada |
|------|--------------------------|
| ORM/ODM | TypeORM / Mongoose |
| Banco de Dados | PostgreSQL / MongoDB |
| Autenticação | Passport + JWT / Google OAuth2 |
| Documentação | Swagger (via @nestjs/swagger) |
| Deploy | Docker Compose |
| Testes | Jest / Supertest |

---