import { CreateRequestAttributes, RequestUtil } from '../../test/request-util';

import { Ticket } from '../../models/ticket';

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
  const response = await RequestUtil.createNewTicketRequest({ body: {} });

  expect(response.status).not.toEqual(404);
});

it('should only be accessible, if the user is signed in', async () => {
  await RequestUtil.createNewTicketRequest({ body: {}, expectStatus: 401 });
});

it('should return a status other than 401, if the user is signed in', async () => {
  const response = await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.simpleValid,
  });

  expect(response.status).not.toEqual(401);
});

it('should return an error, if an invalid title is provided', async () => {
  await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.invalidTitle,
    expectStatus: 400,
  });
  await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.emptyTitle,
    expectStatus: 400,
  });
});

it('should return an error, if an invalid price is provided', async () => {
  await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.invalidPrice,
    expectStatus: 400,
  });
  await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.emptyPrice,
    expectStatus: 400,
  });
});

it('should create a ticket with valid inputs', async () => {
  await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.simpleValid,
    expectStatus: 201,
  });

  const tickets = await Ticket.find();
  expect(tickets).toMatchObject([requestBodies.simpleValid]);
});
