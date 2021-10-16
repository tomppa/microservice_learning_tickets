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

  await createNewTicketRequest(true, requestBodies.movieTicket, 201);
  await createNewTicketRequest(true, requestBodies.theaterTicket, 201);
  await createNewTicketRequest(true, requestBodies.bookFairTicket, 201);

  const response = await getTicketsRequest(200);

  expect(response.body).toMatchObject(tickets);
});
