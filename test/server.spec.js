const expect = require('chai').expect
const request = require('supertest')
const server = require('../server/index')

describe('server', () => {
  describe('/echo', () => {
    it('works with GET', (done) => {
      const data = {
        name: 'dummy',
        type: 'sample'
      }
      request(server)
        .get('/echo')
        .query(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const resultData = res.body
          expect(resultData.method).to.equal('GET')
          expect(resultData.body).to.deep.equal({})
          expect(resultData.query).to.deep.equal(data)
        })
        .end(done)
    })
    it('works with POST', (done) => {
      const data = {
        name: 'dummy',
        type: 'sample'
      }

      request(server)
        .post('/echo')
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const resultData = res.body
          expect(resultData).to.deep.equal({
            method: 'POST',
            body: data
          })
        })
        .end(done)
    })
    it('works with PUT', (done) => {
      const data = {
        name: 'dummy',
        type: 'sample',
        count: 3
      }

      request(server)
        .put('/echo')
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const resultData = res.body
          expect(resultData).to.deep.equal({
            method: 'PUT',
            body: data
          })
        })
        .end(done)
    })
    it('works with DELETE', (done) => {
      const data = {
        name: 'dummy',
        type: 'sample',
        count: 3
      }

      request(server)
        .del('/echo')
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const resultData = res.body
          expect(resultData).to.deep.equal({
            method: 'DELETE',
            body: data
          })
        })
        .end(done)
    })
  })
})
