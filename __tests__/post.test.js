const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post');
const agent = request.agent(app);

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should get all posts', async () => {
    await agent.get('/api/v1/github/callback?code=42').redirects(1);

    const response = await agent.get('/api/v1/posts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      userID: expect.any(String),
      content: expect.any(String),
    });
  });

  it('should insert new post from a user', async () => {
    const user = await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const response = await agent.post('/api/v1/posts').send({
      user_id: user.body.id,
      content: 'lets go',
    });

    const posts = await Post.getAll();

    expect(response.status).toBe(200);
    expect(posts[posts.length - 1]).toEqual({
      id: expect.any(String),
      userID: '4',
      content: 'lets go',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
