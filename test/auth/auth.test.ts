import { AuthService } from './AuthService';

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('#########', '###########'); // Replace with actual username and password
  const idToken = await service.getIdToken();
  console.log('loginResult', loginResult);
  console.log('idToken', idToken);
}

testAuth();
