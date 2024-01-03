FROM node:14.16.0-alpine

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app

USER root
RUN chmod 777 /app
USER app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 7000

CMD ["npm","start"]
