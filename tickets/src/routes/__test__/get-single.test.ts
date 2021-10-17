import { RequestUtil } from '../../test/request-util';

it('should return 404, if the ticket is not found', async () => {
  await RequestUtil.getTicketRequest({ expectStatus: 404 });
});

it('should return ticket, if the ticket exists', async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  const createResponse = await RequestUtil.createNewTicketRequest({
    generateCookie: true,
    body: ticket,
    expectStatus: 201,
  });
  const getResponse = await RequestUtil.getTicketRequest({
    id: createResponse.body.id,
    expectStatus: 200,
  });

  expect(getResponse.body).toMatchObject(ticket);
});
