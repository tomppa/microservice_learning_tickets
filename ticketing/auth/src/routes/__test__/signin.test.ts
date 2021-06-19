import { signUpRequest, signInRequest } from './test-util';

it('should fail to sign in, when given email does not exist', async () => {
  await signInRequest('test@test.com', 'password', 400);
});

it('should fail to sign in, when incorrect password given', async () => {
  await signUpRequest('test@test.com', 'password', 201);
  await signInRequest('test@test.com', 'passwork', 400);
});

it('should get a cookie, when signing in with correct credentials', async () => {
  await signUpRequest('test@test.com', 'password', 201);
  const response = await signInRequest('test@test.com', 'password', 200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
