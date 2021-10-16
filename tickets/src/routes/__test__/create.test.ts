import request from 'supertest';
import { app } from '../../app';

it('should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('should only be accessible, if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('should return a status other than 401, if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({})
    .expect(200);
});

it('should return an error, if an invalid title is provided', async () => {
  // foobar
});

it('should return an error, if an invalid price is provided', async () => {
  // foobar
});

it('should create a ticket with valid inputs', async () => {
  // foobar
});
