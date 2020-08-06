FROM cypress/base:12.18.0 AS cypress

ENV CI=true

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

# Build the client package in dev mode
RUN cd packages/client && REACT_APP_DEV=true yarn build

# Build the server package
RUN yarn server:build

# Run the unit tests
RUN yarn test

FROM base as dependencies

# Copy everything
COPY . .
