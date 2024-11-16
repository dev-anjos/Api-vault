const validateDataMiddleware = async (req, res, next) => {
    const { pid, quantity } = req.body;
    const pidNumber = parseInt(pid);
    const quantityNumber = parseInt(quantity);
  
    if (!pidNumber || !quantityNumber) {
      return res.status(400).json({ error: 'Dados inválidos' });

    }
  
    req.body.productId = pidNumber;
    req.body.quantity = quantityNumber;
  
    next();
};

module.exports = validateDataMiddleware