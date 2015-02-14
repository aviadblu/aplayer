FROM ubuntu:14.04

RUN sudo apt-get -q -y update
RUN sudo apt-get -q -y install nodejs npm git

RUN sudo ln -s "$(which nodejs)" /usr/bin/node

RUN npm install npm -g
RUN npm install bower -g

WORKDIR /opt/aplayer
COPY . /opt/aplayer

RUN npm install
RUN bower install --allow-root

EXPOSE 3000

CMD node ./server/app.js
