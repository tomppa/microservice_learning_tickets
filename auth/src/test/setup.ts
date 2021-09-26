import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      simpleSignUp(): Promise<string[]>;
      signUp(
        email: string,
        password: string,
        statusCode: number
      ): Promise<request.Response>;
      signIn(
        email: string,
        password: string,
        statusCode: number
      ): Promise<request.Response>;
      signOut(
        email: string,
        password: string,
        statusCode: number
      ): Promise<request.Response>;
      currentUser(
        cookie: string[],
        statusCode: number
      ): Promise<request.Response>;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'my-secret';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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

global.signIn = async (email: string, password: string, statusCode: number) => {
  return postRequest('/api/users/signin', email, password, statusCode);
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
