import { UserService } from './user.service';

// this is a good example of isolated testing, a simple service that does not need any testing boilerplate
describe('UserService', () => {
  it('should create the service', () => {
    const user = new UserService();

    expect(user.isLoggedIn).toBe(true);
    expect(user.user.name).toEqual('Sam Spade');
    expect(user).toMatchSnapshot();
  });
});
