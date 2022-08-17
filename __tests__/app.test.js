const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

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
    const res = await agent.get('/api/v1/github/callback?code=42').redirects(1);
    expect(res.redirects.length).toEqual(1);

    // const session = agent.jar.getCookie(process.env.COOKIE_NAME);
    // expect(session).toMatchObject({
    //   name: process.env.COOKIE_NAME,
    //   value: expect.any(String)
    // });
  });

  it('should log a user out', async () => {
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const response = await agent.delete('/api/v1/github/sessions');

    expect(response.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
