
// const validateProductId = (req, res, next) => {
//   const id = req.params.id;
  
//   if (
//     !id||
//     isNaN(id)||
//     id === 0 
//   ) {
//     return res.status(400).json({ error: 'Dado invalido. Verifique o contrato' });
//   }
//   next();
// };

const validateProductBody = (req, res, next) => {
  const {title , description , price , code , stock , category} = req.body;
 
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    isNaN(parseFloat(price)) ||
    typeof code !== "string" ||
    isNaN(parseFloat(stock)) ||
    typeof category !== "string"
  ) {
    return res.status(400).json(
    { error: "Dados inválidos, verifique os tipos de dados solicitado nos contratos" });
  }
  return next();
};

module.exports = validateProductBody