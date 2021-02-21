FROM node:15.9

ENV LANG en_NZ.utf8

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

WORKDIR /usr/src/app/dist
ENV NODE_ENV=production
EXPOSE 80
CMD [ "index.js" ]
