

// export helper functions
module.exports = {
    requiredFields: (inputFields, validFields) => {
        let noMissingFields = validFields.reduce((result, x) => {
            return result && (x in inputFields);
        }, true)
        return noMissingFields;
    }
}

