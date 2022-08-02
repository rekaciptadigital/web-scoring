FROM node:lts-alpine3.14

RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
RUN apk add curl

CMD mkdir myarchery-web-admin
WORKDIR myarchery-web-admin
COPY . /myarchery-web-admin
CMD mkdir log

RUN addgroup -g 2000 -S docker
RUN adduser -S -G docker -u 2001 -s /bin/sh -h myarchery-web docker

RUN npm uninstall node-sass --force
RUN npm i sass --legacy-peer-deps
RUN npm install --force #--legacy-peer-deps
RUN npm run build

RUN rm -f config/.env

CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log

USER docker
RUN whoami
