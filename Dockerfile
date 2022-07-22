FROM node:lts-alpine3.14

CMD mkdir myarchery-web-admin
WORKDIR myarchery-web-admin
COPY . /myarchery-web-admin
CMD mkdir log

RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
RUN apk add curl
RUN npm cache clean --force

RUN npm uninstall node-sass --force
RUN npm i sass --legacy-peer-deps
RUN npm install --force #--legacy-peer-deps
RUN npm audit fix --force
RUN npm run build

RUN rm -f config/.env

CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log
