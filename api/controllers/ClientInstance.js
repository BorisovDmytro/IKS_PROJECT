  function KeyGen() {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.gen = 3;
    this.mod = 17;
    this.private = getRandomInt(0, 20);
    this.key = 0;

    this.getPrivate = function () {
      return Math.pow(this.gen, this.private) % this.mod;
    }

    this.setPublic = function (pb) {
      this.key = Math.pow(pb, this.private) % this.mod;
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
    const id = data.id;
    const pr = data.private;

    this.keyGen = new KeyGen();

    if(!id)
      res("Invalid id");
    else {
      this.webSocket.id = id;
      if (!this.parent.clients.has(id)) {
        console.log("New connect id: ", id);
        this.parent.addNewClient(id, this);
        this.keyGen.setPublic(pr);
        this.key = this.keyGen.key.toString() + id;

        res(null, {private: this.keyGen.getPrivate()});
      } else {
        res("Invalid auth");
      }
    }
  }

  onDisconnectHandler() {
    this.parent.removeClient(this.webSocket.id);
  }
}

