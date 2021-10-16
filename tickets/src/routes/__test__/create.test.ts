import request from 'supertest';
import { app } from '../../app';

const requestBodies = {
  simpleValid: {
    title: 'foobar',
    price: 10,
  },
  invalidTitle: {
    title: '',
    price: 10,
  },
  emptyTitle: {
    price: 10,
  },
  invalidPrice: {
    title: 'foobar',
    price: -10,
  },
  emptyPrice: {
    title: 'barfoo',
  },
};

it('should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await createNewTicketRequest(false, {}, NaN);

  expect(response.status).not.toEqual(404);
});

it('should only be accessible, if the user is signed in', async () => {
  await createNewTicketRequest(false, {}, 401);
});

it('should return a status other than 401, if the user is signed in', async () => {
  await createNewTicketRequest(true, requestBodies.simpleValid, 200);
});

it('should return an error, if an invalid title is provided', async () => {
  await createNewTicketRequest(true, requestBodies.invalidTitle, 400);
  await createNewTicketRequest(true, requestBodies.emptyTitle, 400);
});

it('should return an error, if an invalid price is provided', async () => {
  await createNewTicketRequest(true, requestBodies.invalidPrice, 400);
  await createNewTicketRequest(true, requestBodies.emptyPrice, 400);
});

it('should create a ticket with valid inputs', async () => {
  // foobar
});

let createNewTicketRequest = async (
  signedIn: boolean,
  body: object,
  expectStatus: number
) => {
  if (signedIn) {
    if (!expectStatus) {
      return await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send(body);
    }

    return await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send(body)
      .expect(expectStatus);
  }

  if (!expectStatus) {
    return await request(app).post('/api/tickets').send(body);
  }

  return await request(app)
    .post('/api/tickets')
    .send(body)
    .expect(expectStatus);
};
