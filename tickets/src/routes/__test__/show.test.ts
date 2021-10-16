it('should return 404, if the ticket is not found', async () => {
  await getTicketRequest('asdfasdfasdf', 404);
});

it('should return ticket, if the ticket exists', async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  const createResponse = await createNewTicketRequest(true, ticket, 201);
  const getResponse = await getTicketRequest(createResponse.body.id, 200);

  expect(getResponse).toMatchObject(ticket);
});
