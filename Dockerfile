FROM node:14-alpine

WORKDIR /app

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

COPY . .

RUN yarn install
