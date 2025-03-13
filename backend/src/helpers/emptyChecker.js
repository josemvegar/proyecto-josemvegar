const emptyChecker = (data, fields=[]) => {

    const missingFields = fields.filter(field => !data.hasOwnProperty(field));

    if (missingFields.length > 0) {
        console.log("Faltan los siguientes campos:", missingFields);
        return missingFields;
    }
    return true;
}

module.exports= emptyChecker;