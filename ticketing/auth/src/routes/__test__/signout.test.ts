it('should get an expired cookie, when signing out', async () => {
  await global.signUp('test@test.com', 'password', 201);
  const response = await global.signOut('test@test.com', 'password', 200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
