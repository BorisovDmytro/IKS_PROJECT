
import authService from './src/AuthService';
import messangerService from './src/MessangerService';
import groupService from './src/GroupService'

export default (app) => {
  authService(app);
  messangerService(app);
  groupService(app);
}