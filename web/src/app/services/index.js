
import authService from './src/AuthService';
import messangerService from './src/MessangerService';

export default (app) => {
  authService(app);
  messangerService(app);
}