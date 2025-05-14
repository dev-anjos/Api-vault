import {isValidObjectId} from "mongoose";

export const validateParams = (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;

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
  
  export const validateCart = (req, res, next) => {
    const {pid, quantity} = req.body;

    console.log(pid, quantity);

    if (!pid && !quantity) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios. middleware'});
    }
  
    next();
  };

export default {validateParams, validateCart};
