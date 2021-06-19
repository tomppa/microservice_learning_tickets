import request from 'supertest';

import { app } from '../../app';

const simpleRequest = async (
  uri: string,
  email: string,
  password: string,
  statusCode: number
) => {
  return request(app)
    .post(uri)
    .send({
      email: email,
      password: password,
    })
    .expect(statusCode);
};

const signUpRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return simpleRequest('/api/users/signup', email, password, statusCode);
};

const signInRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return simpleRequest('/api/users/signin', email, password, statusCode);
};

const signOutRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return simpleRequest('/api/users/signout', email, password, statusCode);
};

export { signUpRequest, signInRequest, signOutRequest };
