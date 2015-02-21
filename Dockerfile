FROM ubuntu:14.04

RUN sudo apt-get -q -y update
RUN sudo apt-get -q -y install nodejs npm git

RUN sudo ln -s "$(which nodejs)" /usr/bin/node

RUN npm install npm -g
RUN npm install bower -g
RUN npm install -g grunt-cli

WORKDIR /opt/aplayer
COPY . /opt/aplayer

RUN sudo npm install
RUN sudo bower install --allow-root


RUN grunt build

EXPOSE 80

CMD node ./server/app.js
