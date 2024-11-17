const validateBodyMiddleware= async (req, res, next) => {

  const { pid, quantity} = req.body 

    const pidNumber = parseInt(pid);
    const quantityNumber = parseInt(quantity);


    if (!pidNumber || !quantityNumber) {
      return res.status(400).json({ error: 'Dados inválidos' });

    }
  
    req.body.pid = pidNumber;
    req.body.quantity = quantityNumber;

  
    next();
};

const validateParamsMiddleware = async (req, res, next) => {
  const { cid } = req.params;

  const cidNumber = parseInt(cid);

  if (!cidNumber) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  req.params.cid = cidNumber; 

  next();
};



module.exports = { validateBodyMiddleware, validateParamsMiddleware };