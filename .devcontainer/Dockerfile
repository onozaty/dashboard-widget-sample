FROM node:24-slim

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y \
    sudo \
    git \
    procps \
    && rm -rf /var/lib/apt/lists/*
