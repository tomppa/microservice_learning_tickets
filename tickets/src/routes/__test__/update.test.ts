import { RequestUtil } from '../../test/request-util';

const requestBodies = {
  movieTicket: {
    title: 'Goldeneye',
    price: 15,
  },
  movieTicketV2: {
    title: 'Goldeneye',
    price: 16,
  },
  brokenTitleTicket: {
    title: '',
    price: 1,
  },
  brokenPriceTicket: {
    title: 'foobar',
    price: -1,
  },
};

const cookie =
  it('should return 404, if the ticket does not exist', async () => {
    await RequestUtil.updateTicketRequest({
      generateCookie: true,
      body: requestBodies.movieTicket,
      expectStatus: 404,
    });
  });

it('should return 401, if the user is not authenticated', async () => {
  await RequestUtil.updateTicketRequest({
    body: requestBodies.movieTicket,
    expectStatus: 401,
  });
});

it('should not update ticket, if the user does not own the ticket', async () => {
  const createResponse = await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: requestBodies.movieTicket,
  });
  await RequestUtil.updateTicketRequest({
    generateCookie: true,
    id: createResponse.body.id,
    body: requestBodies.movieTicketV2,
    expectStatus: 401,
  });
  const getResponse = await RequestUtil.getTicketRequest({
    id: createResponse.body.id,
  });

  expect(getResponse.body).toMatchObject(requestBodies.movieTicket);
});

it('should not update ticket, if the user provides and invalid title or price', async () => {
  const providedCookie = RequestUtil.signIn();

  const createResponse = await RequestUtil.createNewTicketRequest({
    providedCookie,
    body: requestBodies.movieTicket,
  });
  await RequestUtil.updateTicketRequest({
    providedCookie,
    id: createResponse.body.id,
    body: requestBodies.brokenTitleTicket,
    expectStatus: 400,
  });
  await RequestUtil.updateTicketRequest({
    providedCookie,
    id: createResponse.body.id,
    body: requestBodies.brokenPriceTicket,
    expectStatus: 400,
  });
  const getResponse = await RequestUtil.getTicketRequest({
    id: createResponse.body.id,
  });

  expect(getResponse.body).toMatchObject(requestBodies.movieTicket);
});

it('should update the ticket, if inputs are valid', async () => {
  const providedCookie = RequestUtil.signIn();

  const createResponse = await RequestUtil.createNewTicketRequest({
    providedCookie,
    body: requestBodies.movieTicket,
  });
  await RequestUtil.updateTicketRequest({
    providedCookie,
    id: createResponse.body.id,
    body: requestBodies.movieTicketV2,
    expectStatus: 200,
  });
  const getResponse = await RequestUtil.getTicketRequest({
    id: createResponse.body.id,
  });

  expect(getResponse.body).toMatchObject(requestBodies.movieTicketV2);
});
