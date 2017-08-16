const request = require('supertest');
const should = require('should');
const app = require('./index');

describe('douban related api', ()=>{
  const agent = request.agent(app)

  it('should ok', (done)=>{
    agent.get('/')
    .expect('Hello World!', done)
  })

  it('should get book reviews', (done)=>{
    agent
    .get('/api/douban/book/25782902/reviews')
    .expect(200)
    .expect(({body})=>{
      should.exist(body.data)
      should.exist(body.data[0].title)
    })
    .end(done)
  })

  it('should get book review', (done)=>{
    agent
    .get('/api/douban/book/review/6495961')
    .expect(200)
    .expect(({body})=>{
      should.exist(body.title)
      should.exist(body.content)
    })
    .end(done)
  })


  it('should get doulist', (done)=>{
    agent
    .get('/api/douban/doulist/36699814/1')
    .expect(200)
    .expect(({body})=>{
      should.exist(body.title)
      should.exist(body.items)
      should.exist(body.items[0].subject.title)
    })
    .end(done)
  })

  it('should get api douban by proxy', (done)=>{
    agent
    .get('/api/proxy/douban_api/v2/book/25782902')
    .expect(200)
    .expect(({body})=>{
      should.exist(body.rating)
      should.exist(body.tags)
      should.exist(body.catalog)
      should.exist(body.summary)
    })
    .end(done)
  })


  it('should get m douban by proxy', (done)=>{
    agent
    .get('/api/proxy/douban_m_rexxvar/v2/user/9083557/reviews?type=book&start=0&count=50&for_mobile=1')
    .expect(200)
    .expect(({body})=>{
      should.exist(body.total)
      should.exist(body.reviews)
      should.exist(body.reviews[0].abstract)
    })
    .end(done)
  })
})
