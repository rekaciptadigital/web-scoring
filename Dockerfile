FROM node:lts-alpine3.14

CMD mkdir myarchery-web-admin
WORKDIR myarchery-web-admin
COPY . /myarchery-web-admin
CMD mkdir log

RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
RUN apk add curl
#RUN npm cache clean --force
yarn add react-is

RUN npm uninstall node-sass --force
RUN npm i sass --force
RUN npm install --legacy-peer-deps #--force
#RUN npm audit fix
RUN npm run build

RUN rm -f config/.env

CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log
