export default class ClientsController {
  constructor(dbAccountCtrl) {
    this.clients       = new Map();
    this.unAuthClients = [];
    this.dbAccountCtrl = dbAccountCtrl;
  }

  addUnAuth(client) {
    this.unAuthClients.push(client);
  }

  removeUnAuth(client) {
    const indx = this.unAuthClients.indexOf(client);
    if(indx != -1);
      this.unAuthClients.splice(indx, 1);
  }

  delete(id) {
    this.clients.delete(id);
  }

  get(id) {
    return this.clients.get(id);
  }

  has(id) {
    return this.clients.has(id);
  }

  set(id, client) {
    this.clients.set(id, client);
    this.removeUnAuth(client);
  }

  values() {
    return this.clients.values();
  }
}