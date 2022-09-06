FROM node:lts-alpine3.10

RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://
RUN apk add curl
RUN apk add --no-cache python2
#RUN npm cache clean --force

CMD mkdir myarchery-web-admin
WORKDIR myarchery-web-admin
COPY . /myarchery-web-admin
CMD mkdir log

RUN addgroup -g 2000 -S docker
RUN adduser -S -G docker -u 2001 -s /bin/sh -h myarchery-web docker

RUN npm install -g node-gyp
RUN npm install -g npm
#RUN npm uninstall node-sass --force
#RUN npm install node-sass@4.14.1 --legacy-peer-deps
RUN npm rebuild node-sass
#RUN npm i sass --force
#RUN npm install --global windows-build-tools --legacy-peer-deps
#RUN npm install --legacy-peer-deps #--force
RUN yarn add react-is
#RUN npm audit fix
RUN npm run build

RUN rm -f config/.env

CMD npm start >> /root/log/stdout.log 2>> /root/log/stderr.log

#USER docker
#RUN whoami
