import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  function simpleSignUp(): Promise<string[]>;
  function signUp(
    email: string,
    password: string,
    statusCode: number
  ): Promise<request.Response>;
  function signIn(): string[];
  function currentUser(
    cookie: string[],
    statusCode: number
  ): Promise<request.Response>;
  function signOut(
    email: string,
    password: string,
    statusCode: number
  ): Promise<request.Response>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'my-secret';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

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

global.signUp = async (email: string, password: string, statusCode: number) => {
  return postRequest('/api/users/signup', email, password, statusCode);
};

global.simpleSignUp = async () => {
  const response = await global.signUp('test@test.com', 'password', 201);

  return response.get('Set-Cookie');
};

global.signIn = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: 'a0sd9f823l4kj',
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON.
  const sessionJson = JSON.stringify(session);

  // Take JSON, and encode it as base64.
  const base64 = Buffer.from(sessionJson).toString('base64');

  // Return a string that's the cookie with the encoded data.
  return [`express:sess=${base64}`];
};

global.signOut = async (
  email: string,
  password: string,
  statusCode: number
) => {
  return postRequest('/api/users/signout', email, password, statusCode);
};

global.currentUser = async (cookie: string[], statusCode: number) => {
  return getRequest('/api/users/currentuser', cookie, statusCode);
};
