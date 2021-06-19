import { signUpRequest, signOutRequest } from './test-util';

it('should get an expired cookie, when signing out', async () => {
  await signUpRequest('test@test.com', 'password', 201);
  const response = await signOutRequest('test@test.com', 'password', 200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
