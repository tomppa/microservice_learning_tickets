import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  function createNewTicketRequest(
    signedIn: boolean,
    body: object,
    expectStatus: number
  ): Promise<request.Response>;
  function getTicketRequest(
    id: string,
    expectStatus: number
  ): Promise<request.Response>;
}

const basePath = '/api/tickets/';

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

global.createNewTicketRequest = async (
  signedIn: boolean,
  body: object,
  expectStatus: number
) => {
  if (signedIn) {
    if (!expectStatus) {
      return await request(app)
        .post(basePath)
        .set('Cookie', signIn())
        .send(body);
    }

    return await request(app)
      .post(basePath)
      .set('Cookie', signIn())
      .send(body)
      .expect(expectStatus);
  }

  if (!expectStatus) {
    return await request(app).post(basePath).send(body);
  }

  return await request(app).post(basePath).send(body).expect(expectStatus);
};

global.getTicketRequest = async (id: string, expectStatus: number) => {
  const path = `${basePath}${id}`;

  if (!expectStatus) {
    return await request(app).get(path).send();
  }

  return await request(app).get(path).send().expect(expectStatus);
};

const signIn = () => {
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
