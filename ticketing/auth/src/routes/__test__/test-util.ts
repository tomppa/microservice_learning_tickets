import request from 'supertest';

import { app } from '../../app';

const postRequest = async (
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

const getRequest = async (
  uri: string,
  cookie: string[],
  statusCode: number
) => {
  return request(app).get(uri).set('Cookie', cookie).send().expect(statusCode);
};

const signUpRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return postRequest('/api/users/signup', email, password, statusCode);
};

const signInRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return postRequest('/api/users/signin', email, password, statusCode);
};

const signOutRequest = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return postRequest('/api/users/signout', email, password, statusCode);
};

const currentUserRequest = async (cookie: string[], statusCode: number) => {
  return getRequest('/api/users/currentuser', cookie, statusCode);
};

export { signUpRequest, signInRequest, signOutRequest, currentUserRequest };
