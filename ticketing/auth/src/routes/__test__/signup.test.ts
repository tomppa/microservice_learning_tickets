import { signUpRequest } from './test-util';

describe('validation', () => {
  it('should return a 201 on successful signup', async () => {
    await signUpRequest('test@test.com', 'password', 201);
  });

  it('should return a 400, when email is invalid', async () => {
    await signUpRequest('testtest.com', 'password', 400);
  });

  it('should return a 400, when password is invalid', async () => {
    await signUpRequest('test@test.com', 'p', 400);
  });

  it('should return a 400, when email is empty', async () => {
    await signUpRequest('', 'password', 400);
  });

  it('should return a 400, when password is empty', async () => {
    await signUpRequest('test@test.com', '', 400);
  });

  it('should not allow duplicate emails', async () => {
    await signUpRequest('test@test.com', 'password', 201);
    await signUpRequest('test@test.com', 'password', 400);
  });
});

describe('other stuff', () => {
  it('should set a cookie after successful sign up', async () => {
    const response = await signUpRequest('test@test.com', 'password', 201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
