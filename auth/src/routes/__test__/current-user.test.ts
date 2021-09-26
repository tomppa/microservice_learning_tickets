it('should respond with details about current user', async () => {
  const cookie = await global.simpleSignUp();
  const response = await global.currentUser(cookie, 200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('should respond with null, if not authenticated', async () => {
  const response = await global.currentUser([''], 200);

  expect(response.body.currentUser).toBeNull();
});
