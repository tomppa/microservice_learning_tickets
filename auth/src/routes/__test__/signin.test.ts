it('should fail to sign in, when given email does not exist', async () => {
  await global.signIn('test@test.com', 'password', 400);
});

it('should fail to sign in, when incorrect password given', async () => {
  await global.signUp('test@test.com', 'password', 201);
  await global.signIn('test@test.com', 'passwork', 400);
});

it('should get a cookie, when signing in with correct credentials', async () => {
  await global.signUp('test@test.com', 'password', 201);
  const response = await global.signIn('test@test.com', 'password', 200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
