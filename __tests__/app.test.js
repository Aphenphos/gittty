const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { AcessCookie } = require('cookiejar');

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect user to oauth page', async () => {
    const res = await request(app).get('/api/v1/github/login');

    expect(res.redirect).toEqual(true);
  });

  it('should redirect users to posts', async () => {
    const agent = request.agent(app);
    const res = await agent.get('/api/v1/github/callback?code=42').redirects(1);
    expect(res.redirects.length).toEqual(1);

    const session = agent.jar.getCookie(process.env.COOKIE_NAME, AcessCookie.All);
    expect(session).toMatchObject({
      name: process.env.COOKIE_NAME,
      value: expect.any(String)
    });
  });

  it('should log a user out', async () => {
    // "Log in"
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42');

    let session = agent.jar.getCookie(process.env.COOKIE_NAME, AcessCookie.All);
    expect(session).toBeTruthy();

    const res = await agent.delete('/api/v1/github');
    expect(res.status).toEqual(204);

    session = agent.jar.getCookie(process.env.COOKIE_NAME, AcessCookie.All);
    expect(session).toBeUndefined();
  });
  afterAll(() => {
    pool.end();
  });
});
