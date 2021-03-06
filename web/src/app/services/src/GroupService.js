'use strict'

export default (app) => {
  class GroupService {
    constructor($http) {
      this.http = $http;
    }

    getAccountGroup(id, cb) {
      this.http({
        method: 'GET',
        url: '/group',
        params: {
          id: id
        }
      }).then((answ) => {
        const group = answ.data;
        cb(null, group);
      }).catch((err) => {
        console.error(err);
        cb(err);
      });
    }

    addGroup(id, name, users, cb) {
      this.http({
        method: 'PUT',
        url: '/group',
        params: {
          owner: id,
          name: name
        },
        data: {
          users: users
        }
      }).then((answ) => {
        const res = answ.data;
        cb(null, res);
      }).catch((err) => {
        console.error(err);
        cb(err);
      });
    }

    addUsersToGroup(idGroup, users, cb) {
      this.http({
        method: 'POST',
        url: '/group',
        params: { id: idGroup },
        data: { users: users }
      }).then((answ) => {
        const res = answ.data;
        cb(null, res);
      }).catch((err) => {
        console.error(err);
        cb(err);
      });
    }

    removeUserFromGroup(idGroup, userId, cb) {
      this.http({
        method: 'DELETE',
        url: '/group',
        params: { id: idGroup, user: userId }
      }).then((answ) => {
        const res = answ.data;
        cb(null, res);
      }).catch((err) => {
        console.error(err);
        cb(err);
      });
    }

  }

  app.service("groupService", GroupService);
}
