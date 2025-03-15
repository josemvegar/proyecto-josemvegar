const emptyChecker = (data, fields = []) => {
    const missingFields = fields.filter(field => !data.hasOwnProperty(field));
    if (missingFields.length > 0) {
      return missingFields.map(field => `Falta el campo: ${field}`);
    }
    return true;
  };
  
  module.exports = emptyChecker;
  