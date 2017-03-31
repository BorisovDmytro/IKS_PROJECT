"use strict"

export default class GroupApiController {
  constructor(dbGroupCtrl, dbAccountCtrl) {
    this.dbGroupCtrl   = dbGroupCtrl;
    this.dbAccountCtrl = dbAccountCtrl;
  }
  // {id: you account id }
  getAccountGroup(req, res) {
    const idAccount = req.query.id;
    console.log("/group id :", idAccount);
    if (!idAccount) {
      res.status(400).send("error input data");
      return;
    }

    this.dbGroupCtrl
      .getByUser(idAccount)
      .then((groups) => {
        res.status(200).send(groups);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send("invalid data");
      });
  }
  // {owner: you account id, name: group name, users [] // body }
  addGroup(req, res) {
    const name  = req.query.name;
    const owner = req.query.owner;
    const users = req.body.users || [];
    console.log("AddGroup", req.query, req.body);
    if (!name || !owner) {
      res.status(400).send("error input data");
      return;
    }

    this.dbGroupCtrl
      .add(name, owner, users)
      .then(() => {
        res.status(200).send("success");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
  // {idGroup: gId,user: id} post /group body {users: []}
  addUserToGroup(req, res) {
    const id    = req.query.idGroup;
    const users = req.body.users;

    if (!id || !users) {
      res.status(400).send("error input data");
      return;
    }

    this.dbGroupCtrl
      .getById(id)
      .the((group) => {
        for (user of users) {
          group.users.push(user);
        }
        
        return this.dbGroupCtrl.update(id, group);
      }).then(() => {
        res.status(200).send("success");
      }).catch((err) => {
        res.status(500).send(err);
      });
  }
  // {idGroup: gId, user: id}
  removeUserFromGroup(req, res) {
    const id   = req.query.id;
    const user = req.query.user;

    if (!id || !user) {
      res.status(400).send("error input data");
      return;
    }

    this.dbGroupCtrl
      .getById(id)
      .then((group) => {
        let users       = group.users;
        let removeIndex = users.indexOf(user);

        if (removeIndex != -1) {
          users.users.splice(removeIndex, 1);
          return this.dbGroupCtrl.update(id, group);
        } else {
          res.status(400).send("user not found");
        }
      })
      .then(() => {
         res.status(200).send("success");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}