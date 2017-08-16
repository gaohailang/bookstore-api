const express = require('express')
const app = express()
const https = require('https')
const bodyParser   = require('body-parser');

const proxy = require('http-proxy-middleware')

const HostDoubanApi = 'https://api.douban.com'
const HostDoubanMRexxar = 'https://m.douban.com/rexxar/api'

const douban = require('./helpers/scrapit-douban')
var {review, reviews, doulist} = douban


app.use('/api/proxy/douban_api', proxy({
  pathRewrite: {
    '^/api/proxy/douban_api': '',
  },
  agent  : https.globalAgent,
  target: HostDoubanApi,
  changeOrigin:  true,
}))


app.use('/api/proxy/douban_m_rexxvar', proxy({
  pathRewrite: {
    '^/api/proxy/douban_m_rexxvar': '',
  },
  agent  : https.globalAgent,
  target: HostDoubanMRexxar,
  changeOrigin:  true,
}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/api/douban/book/:id/reviews', (req, res)=>{
  reviews(req.params.id, (data)=>{
    res.json(data)
  })
})

app.get('/api/douban/book/review/:id', (req, res)=>{
  review(req.params.id, (data)=>{
    res.json(data)
  })
})

app.get('/api/douban/doulist/:id/:page', (req, res)=>{
  doulist(req.params.id, req.params.page, (data)=>{
    res.json(data)
  })
})

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = exports = app;
