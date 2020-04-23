FROM cypress/base:12.16.1 AS cypress

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install Lerna
RUN npm i -g lerna

# Create app directory
WORKDIR /usr/app

FROM cypress AS base

COPY . .

# Install all dependencies with Lerna
RUN lerna bootstrap

# Build the utils package
RUN yarn utils:build

# Build the client packages
RUN yarn client:build

# Build the server packages
RUN yarn server:build

FROM base as dependencies

# Copy everything
COPY . .
