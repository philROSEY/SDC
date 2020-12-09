FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

COPY package*.json ./

RUN npm install

EXPOSE 80

CMD ["npm", "start"]