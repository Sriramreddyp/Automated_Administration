FROM node:14.16.0-alpine

# RUN addgroup app && adduser -S -G app
# USER app
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 7000

CMD ["npm","start"]
