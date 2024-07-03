FROM node:21-alpine

WORKDIR /app

COPY . .

RUN npm i
RUN npm i express

EXPOSE 8000

CMD ["npm","start"]