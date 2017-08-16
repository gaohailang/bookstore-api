FROM circleci/node:7.10

RUN yarn install

ADD . /opt/bookstore-api

EXPOSE 3000

CMD ["npm start"]
