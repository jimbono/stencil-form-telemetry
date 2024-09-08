import { UserService, UserData } from './telemetry-types';

export class MockUserService implements UserService {
  private users: { [key: string]: UserData } = {
    '12345': {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'New York'
    }
  };

  async getUserData(userId: string): Promise<UserData> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const user = this.users[userId];
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async updateUserData(userId: string, userData: UserData): Promise<UserData> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (!this.users[userId]) {
      throw new Error('User not found');
    }
    this.users[userId] = { ...userData, id: userId };
    return { ...this.users[userId] };
  }
}