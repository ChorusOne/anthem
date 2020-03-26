FROM node:10-alpine

RUN apk update && apk add bash curl jq

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files into Docker Image
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Bundle app source
COPY . .

# Build the app
RUN yarn build

# production env
ENV NODE_ENV=production

# Expose PORT
EXPOSE 8080

# Start the server

RUN chmod +x /usr/src/app/entrypoint.sh

CMD [ "node", "build/src/server.js" ]
