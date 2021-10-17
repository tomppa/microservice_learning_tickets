it('should return 404, if the ticket does not exist', async () => {
  await udpateTicketRequest(true, '', {}, 404);
});

it('should return 401, if the user is not authenticated', async () => {
  await udpateTicketRequest(false, '', {}, 401);
});

it('should return 401, if the user does not own the ticket', async () => {
  // foo
});

it('should return 400, if the user provides and invalid title or price', async () => {
  // foo
});

it('should update the ticket, if inputs are valid', async () => {
  // foo
});
