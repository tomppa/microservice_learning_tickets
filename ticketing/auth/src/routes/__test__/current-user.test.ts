import { signUpRequest, currentUserRequest } from './test-util';

it('should respond with details about current user', async () => {
  const signupResponse = await signUpRequest('test@test.com', 'password', 201);
  const cookie = signupResponse.get('Set-Cookie');

  const response = await currentUserRequest(cookie, 200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
