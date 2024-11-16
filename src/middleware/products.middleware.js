
const validateDataMiddleware = async (req, res, next) => {
    const { limit, title, description, price, thumbnail = {}, code, stock, category, status} = req.body;
    const {id} = req.params

    const limitNumber = parseInt(limit);
    const titleString = String(title);
    const descriptionString = String(description);
    const priceNumber = parseInt(price);
    const thumbnailString = String(thumbnail);
    const codeString = String(code);
    const stockNumber = parseInt(stock);
    const categoryString = String(category);
    const statusBoolean = Boolean(status);
    const idNumber = parseInt(id);
  
    if (
      !!idNumber ||
      !!limitNumber ||
      !!titleString ||
      !!descriptionString ||
      !!priceNumber ||
      !!thumbnailString ||
      !!codeString ||
      !!stockNumber ||
      !!categoryString ||
      !!statusBoolean ||
      !!idNumber
    ) {
      return res.status(400).json({ error: "Dados inválidos, verifique os contratos" });
    }
  
    req.body.limit = limitNumber;
    req.body.title = titleString;
    req.body.description = descriptionString;
    req.body.price = priceNumber;
    req.body.thumbnail = thumbnailString;
    req.body.code = codeString;
    req.body.stock = stockNumber;
    req.body.category = categoryString;
    req.body.status = statusBoolean;
    req.params.id = idNumber;
  
    next();
};

module.exports = validateDataMiddleware ;