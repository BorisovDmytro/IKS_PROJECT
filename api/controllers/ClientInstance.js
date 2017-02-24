class ClientDH {
  constructor(isGenerate) {
    if (isGenerate) {
      this.gen = this._getGenerator(this._getRandomInt(0, 2));
      this.mod = this._getRandomInt(111111111, 999999999);
    }

    this.private = this._getRandomInt(2, 8);
    this.key = 0;
  }

  getPrivate() {
    return Math.pow(this.gen, this.private) % this.mod;
  }

  setPublic(pb) {
    let key = Math.pow(pb, this.private) % this.mod;
    key = key.toString(16);
    while (key.lenght < 9) {
      key += "0";
    }
    this.key = key;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getGenerator(gen) {
    return 2 * gen + 2;
  }
}

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
    const id  = data.id;
    const pr  = data.private;
    const gen = data.gen;
    const mod = data.mod;

    this.clientDH = new ClientDH();

    if(!id)
      res("Invalid id");
    else {
      this.webSocket.id = id;
      if (!this.parent.clients.has(id)) {
        console.log("New connect id: ", id);
        this.parent.addNewClient(id, this);

        this.clientDH.gen = gen;
        this.clientDH.mod = mod;
        this.clientDH.setPublic(pr);
        this.key = this.clientDH.key.toString() + id;
        res(null, {private: this.clientDH.getPrivate()});
      } else {
        res("Invalid auth");
      }
    }
  }

  onDisconnectHandler() {
    this.parent.removeClient(this.webSocket.id);
  }
}

