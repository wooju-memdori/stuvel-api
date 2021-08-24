# syntax=docker/dockerfile:1

FROM node:14.15.1
ENV NODE_ENV=production

WORKDIR /stuvel-api

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "./bin/www" ]
