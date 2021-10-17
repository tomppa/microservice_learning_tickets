import { RequestUtil } from '../../test/request-util';

const requestBodies = {
  movieTicket: {
    title: 'Goldfinger',
    price: 18,
  },
  theaterTicket: {
    title: 'Cats',
    price: 100,
  },
  bookFairTicket: {
    title: 'Big Bad Wolf',
    price: 5,
  },
};

it('should retrieve a list of tickets', async () => {
  const tickets = [
    requestBodies.movieTicket,
    requestBodies.theaterTicket,
    requestBodies.bookFairTicket,
  ];
  const generateCookie = true;

  await RequestUtil.createNewTicketRequest({
    generateCookie,
    body: requestBodies.movieTicket,
    expectStatus: 201,
  });
  await RequestUtil.createNewTicketRequest({
    generateCookie,
    body: requestBodies.theaterTicket,
    expectStatus: 201,
  });
  await RequestUtil.createNewTicketRequest({
    generateCookie,
    body: requestBodies.bookFairTicket,
    expectStatus: 201,
  });

  const response = await RequestUtil.getTicketsRequest({ expectStatus: 200 });

  expect(response.body).toMatchObject(tickets);
});
