export default class ClientInstance {
  constructor(webSocket, parent) {
    this.webSocket = webSocket;
    this.parent    = parent;

    this.webSocket.on('auth',       this.onAuthHandler.bind(this));
    this.webSocket.on('disconnect', this.onDisconnectHandler.bind(this));
  }

  get() {
    return this.webSocket;
  }

  onAuthHandler(data, res) {
    let id = data.id;
    if(!id)
      res("Invalid id");
    else {
      this.webSocket.id = id;
      if (!this.parent.clients.has(id)) {
        console.log("New connect id: ", id);
        this.parent.addNewClient(id, this);
        res(null, "success");
      } else {
        res("Invalid auth");
      }
    }
  }

  onDisconnectHandler() {
    this.parent.removeClient(this.webSocket.id);
  }
}

