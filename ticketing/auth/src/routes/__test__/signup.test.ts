import request from 'supertest';

import { app } from '../../app';

const signUpUri = '/api/users/signup';

const simpleRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return request(app)
    .post(signUpUri)
    .send({
      email: email,
      password: password,
    })
    .expect(statusCode);
};

describe('validation', () => {
  it('should return a 201 on successful signup', async () => {
    await simpleRequest('test@test.com', 'password', 201);
  });

  it('should return a 400, when email is invalid', async () => {
    await simpleRequest('testtest.com', 'password', 400);
  });

  it('should return a 400, when password is invalid', async () => {
    await simpleRequest('test@test.com', 'p', 400);
  });

  it('should return a 400, when email is empty', async () => {
    await simpleRequest('', 'password', 400);
  });

  it('should return a 400, when password is empty', async () => {
    await simpleRequest('test@test.com', '', 400);
  });

  it('should not allow duplicate emails', async () => {
    await simpleRequest('test@test.com', 'password', 201);
    await simpleRequest('test@test.com', 'password', 400);
  });
});

describe('other stuff', () => {
  it('should set a cookie after successful sign up', async () => {
    const response = await simpleRequest('test@test.com', 'password', 201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
