FROM node:10-alpine

RUN apk update && apk add bash curl jq

# Create app directory
WORKDIR /usr/src/app

# Copy files
COPY . .

# Install Lerna
RUN npm i -g lerna

# Install dependencies
RUN lerna bootstrap

# Build utils package
RUN yarn utils:build

# Build the server
RUN yarn server:build

# Bundle app source
# COPY packages/server/ ./

# production env
ENV NODE_ENV=production

# Expose PORT
EXPOSE 8080

# Start the server
RUN chmod +x /usr/src/app/packages/server/entrypoint.sh

CMD [ "node", "packages/server/build/src/server.js" ]
