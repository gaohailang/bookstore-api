const scrapeIt = require("scrape-it");
var cheerio = require('cheerio')

function reviews(bookId, cb) {
  const RE_REVIVE_COUNT = /全部书评\s\((\d*)\)/ // assert 全部书评 (158)
  scrapeIt(`https://m.douban.com/book/subject/${bookId}/reviews`, {

    count: {
      selector: '.title-wrapper h1',
      convert: x => RE_REVIVE_COUNT.exec(x)[1]
    },
    data: {
      listItem: ".review-list .list li",
      data: {
        title: 'h3',
        author: {
          selector: 'img',
          attr: 'src'
        },
        rating: {
          selector: 'span',
          attr: 'data-rating'
        },
        info: '.info',
        abstract: '.abstract',
        id: {
          selector: "a",
          attr: "href",
          convert: (v)=> v.replace('/book/review/', '').replace('/', '')
        }
      }
    }
  }).then(page => {

    console.dir(page);
    cb(page)
  });
}

function review(reviewId, cb) {
  const RE_REVIVE_COMMENT_COUNT = /回应\((\d*)\)/ // assert 回应(31)
  scrapeIt(`https://m.douban.com/book/review//${reviewId}`, {

    title: '.title',
    content: {
      selector: '.paper',
      // how: 'html',
      how: ($paper)=>{
        // 去除 vote-btn-group
        // short, full 只有当内容多的时候才会有
        const $ = cheerio.load($paper.html())
        $('.vote-btn-group').remove()
        const $p = $('.full').length ? $('.full') : $;
        return $p.html().trim().replace(/https:\/\/img/g, 'http://img')
        // hack httsp access http with no refer header
      }
    },

    // author_name: '',
    // author_avatar: '',
    // rating: '',

    comments_count: {
      selector: '.note-comments h2',
      convert: x => RE_REVIVE_COMMENT_COUNT.exec(x)[1]
    },
    comments: {
      listItem: ".comment-list li",
      data: {
        content: '.content'
      }
    },
  }).then(page => {
    console.dir(page);
    cb(page)
  });
}

function people_reviews(peopleId, cb) {
  const RE_REVIVE_COMMENT_COUNT = /回应\((\d*)\)/ // assert 回应(31)
  scrapeIt(`https://m.douban.com/book/review//${reviewId}`, {

    title: '.title',
    content: '.full', // 去除 vote-btn-group

    // author_name: '',
    // author_avatar: '',
    // rating: '',

    comments_count: {
      selector: '.note-comments h2',
      convert: x => RE_REVIVE_COMMENT_COUNT.exec(x)[1]
    },
    comments: {
      listItem: ".comment-list li",
      data: {
        content: '.content'
      }
    },
  }).then(page => {
    console.dir(page);
    cb(page)
  });
}

function trimNewline(v) {
  return v.replace(/\n\s*/g, ' - ')
}

function doulist(id, page, cb) {
  page = +page
  var start = (page-1)*25
  console.log(`https://www.douban.com/doulist/${id}/?start=${start}`)
  scrapeIt({
    url: `https://www.douban.com/doulist/${id}/?start=${start}`,
    headers: {
      Referer: 'https://m.douban.com/doulist/43430373/?start=25',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
    }
  }, {

    title: '#content h1',
    updatedAt: {
      selector: '.meta .time',
      convert: trimNewline
    },
    total: {
      selector: '.doulist-filter .active span',
      convert: x => +(x.replace('(','').replace(')',''))
    },

    items: {
      listItem: ".doulist-item",
      data: {
        type: '.source',
        title: '.title',
        image: {
          selector: '.post img',
          attr: 'src'
        },
        rating: {
          selector: '.rating',
          convert: trimNewline
        },
        info: {
          selector:  '.abstract',
          convert: trimNewline
        },
        id: {
          selector: '.post a',
          attr: 'href',
          convert: (x)=>{
            try{
              return /\S*?(\d+)\//.exec(x)[1]
            }catch(e) {
              return ''
            }
          }
        }
      }
    },
  }).then(page => {
    page = Object.assign({}, page, {
      start: start,
      count: 25,
    })
    page.items = page.items.map((i)=>{
        return {
          id: i.id,
          subject: {
            id: i.id,
            title: i.title,
            pic: {normal: i.image},
            rating: {
              count: i.rating,
              value: ''
            }
          }
        }
    })
    console.dir(page);
    cb(page)
  });
}

module.exports = {reviews, review, doulist};

// export {reivews, reivew}
