import request from 'supertest';

import { app } from '../../app';

const signUpUri = '/api/users/signup';

it('should return a 201 on successful signup', async () => {
  return request(app)
    .post(signUpUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('should return a 400, when email is invalid', async () => {
  return request(app)
    .post(signUpUri)
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400);
});

it('should return a 400, when password is invalid', async () => {
  return request(app)
    .post(signUpUri)
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('should return a 400, when email is empty', async () => {
  return request(app)
    .post(signUpUri)
    .send({
      email: '',
      password: 'password',
    })
    .expect(400);
});

it('should return a 400, when password is empty', async () => {
  return request(app)
    .post(signUpUri)
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
});

it('should not allow duplicate emails', async () => {
  await request(app)
    .post(signUpUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(signUpUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});
