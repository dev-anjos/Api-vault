const validateParams = (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;


  if (pid && (isNaN(pid) || pid <= 0)) {
    return res.status(400).json({ error: 'PID inválido' });
  }

  if (cid && (isNaN(cid) || cid <= 0)) {
    return res.status(400).json({ error: 'CID inválido' });
  }



  next();
};
  
  const validateCart = (req, res, next) => {
    const {pid, quantity} = req.body;

    console.log(pid, quantity);

    if (!pid || isNaN(pid) || pid <= 0) {
      return res.status(400).json({ error: 'PID inválido' });
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }
    
 
    next();
  };
  module.exports = {
    validateParams,
    validateCart
  }