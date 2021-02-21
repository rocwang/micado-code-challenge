# Avaiable environement variables: API_HOST, API_PORT
FROM node:15.9 as builder

WORKDIR /tmp/build
COPY . .

RUN npm install
RUN npm run build

#-------------------------------------------------------------------------------

FROM nginx:1.19

ENV LANG en_NZ.utf8

WORKDIR /usr/share/nginx/html

COPY --from=builder  /tmp/build/build .
COPY nginx/default.conf.template /etc/nginx/templates/
