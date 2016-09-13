FROM node:5

RUN mkdir -p /stalk-server

ENV STALK_HOME /stalk-server

ADD . ${STALK_HOME}/

WORKDIR $STALK_HOME
RUN npm install

CMD ["./bin/start"]
