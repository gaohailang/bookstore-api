豆瓣爬虫和API 相关

[![CircleCI](https://circleci.com/gh/gaohailang/bookstore-api.svg?style=svg)](https://circleci.com/gh/gaohailang/bookstore-api)

cirlce ci 构建成功后，在服务器上运行相应日期tag的镜像：
docker run -it -p 3000:3000 sivagao/bookstore-api:2017-08-17

### Tip

Mocha timeout 网络问题接口没有执行完。
timeout of 2000ms exceeded. Ensure the done() callback
mocha -t 100000 test
