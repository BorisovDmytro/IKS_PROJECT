"use strict"

import Encryption from './../utils/Encryption.js';

export default class AuthCtrl {
  constructor(accountCtrl) {
    this.accountCtrl = accountCtrl;
  }

  login(req, res) {
    const email = req.body.email;
    const pass  = req.body.pass;

    if (!email || !pass) {
      res.status(404).send("not valid data");
      return;
    }
      
    this.accountCtrl
    .getByEmail(email)
    .then((account) => {
      if (Encryption.validatePassword(pass, account.pass))
        res.status(200).send({ id: account._id, name: account.name });
      else
        res.status(404).send("not valid data");
    })
    .catch((err) => {
       res.status(404).send("not valid data");
    });

  }

  signUp(req, res) {
    const email = req.body.email;
    const pass  = req.body.pass;
    const name  = req.body.name;

    if (!email || !pass || !name) {
       res.status(400).send("not valid data");
       return;
    }

    this.accountCtrl
    .insert(email, name, pass)
    .then((acocunt) => {
      res.status(200).send("success");
    })
    .catch((err) => {
        res.status(400).send("not valid data");
    });

  }

  getAccounts(req, res) {
    this.accountCtrl
    .getAll()
    .then((accounts) => {
      res.status(200).send(accounts);
    })
    .catch((err) => {
      res.status(400).send("not valid data");
    });
  }
}
