FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm cache clear --force
RUN npm install

COPY . .

ENV NODE_ENV=dev



RUN npm run build


CMD ["sh","-c","npm run start:prod"]