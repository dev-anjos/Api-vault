const {isValidObjectId} = require("mongoose");
const validateParams = (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  console.log(pid, cid);


  if (!isValidObjectId(pid)) {
    return res.status(400).json({ error: 'Formato PID inválido' });
  }

  if (!isValidObjectId(cid)) {
    return res.status(400).json({ error: 'Formato CID inválido' });
  }

  if (!req.body.quantity) {
    return res.status(400).json({ error: 'Quantidade é obrigatória' });
  }

  next();
};
  
  const validateCart = (req, res, next) => {
    const {pid, quantity} = req.body;

    // if (pid === "") {
    //   console.log(pid);
    //   return res.status(400).json({ error: 'PID inválido' });
    // }
    //
    // if (!quantity || isNaN(quantity) || quantity <= 0) {
    //   return res.status(400).json({ error: 'Quantidade inválida' });
    // }

    if (!pid || !quantity) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios. middleware'});
    }
  
    next();
  };

  module.exports = {
    validateParams,
    validateCart
  }