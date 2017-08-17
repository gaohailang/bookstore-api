FROM circleci/node:7.10

MAINTAINER sivagao@126.com

USER root

# permission error!!
RUN mkdir -p /opt/bookstore-api
WORKDIR /opt/bookstore-api

RUN yarn install

ADD . /opt/bookstore-api

EXPOSE 3000

CMD npm start
