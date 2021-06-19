describe('validation', () => {
  it('should return a 201 on successful signup', async () => {
    await global.signUp('test@test.com', 'password', 201);
  });

  it('should return a 400, when email is invalid', async () => {
    await global.signUp('testtest.com', 'password', 400);
  });

  it('should return a 400, when password is invalid', async () => {
    await global.signUp('test@test.com', 'p', 400);
  });

  it('should return a 400, when email is empty', async () => {
    await global.signUp('', 'password', 400);
  });

  it('should return a 400, when password is empty', async () => {
    await global.signUp('test@test.com', '', 400);
  });

  it('should not allow duplicate emails', async () => {
    await global.signUp('test@test.com', 'password', 201);
    await global.signUp('test@test.com', 'password', 400);
  });
});

describe('other stuff', () => {
  it('should set a cookie after successful sign up', async () => {
    const cookie = await global.simpleSignUp();

    expect(cookie).toBeDefined();
  });
});
