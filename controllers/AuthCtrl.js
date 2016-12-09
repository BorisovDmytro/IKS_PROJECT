"use strict"

const Encryption = require('./../utils//Encryption.js')

class AuthCtrl {
  constructor(accountCtrl) {
    this.accountCtrl = accountCtrl;
  }
// {email: "1@gmail.com", pass: "55446"}

// /agaga/:params?data=10
//agaga/20?data=10 
//req.params.params // 20
//req.query.data // 10
  login(req, res) {  
    const email = req.body.email;
    const pass  = req.body.pass;

    if(!email || !pass) 
      res.status(404).send("not valid data");
    else {
      this.accountCtrl.getByEmail(email, (err, account) => {
        if(err) 
          res.status(404).send("not valid data");
        else {
          if(Encryption.validatePassword(pass, account.pass))
            res.status(200).send({id: account._id, name: account.name});
          else 
            res.status(404).send("not valid data");
        }  
      });
    }  
  }

  signUp(req, res) {
    // email
    // pass
  }
}

module.exports = AuthCtrl;