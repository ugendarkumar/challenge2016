import 'dotenv/config';
import bcrypt from 'bcrypt-nodejs';

// export helper functions
module.exports = {
    requiredFields: (inputFields, validFields) => {
        let noMissingFields = validFields.reduce((result, x) => {
            return result && (x in inputFields);
        }, true)
        return noMissingFields;
    },
    isAuthorized: (req, res, next) => {
        if (!req.headers.secretkey) return res.status(400).send('Headers Missing')
        let isAuthorized = bcrypt.compareSync(req.headers.secretkey, process.env.SECRETKEY || '$2a$08$1yRxA2pVLmttBjtLohY8xuihmH91newIbLnXc2hBMmcKTWEfsxWI2');
        if (isAuthorized) {
            next()
        } else {
            var err = new Error('Request Not authorized!');
            err.status = 401;
            return res.status(401).send(err.message);
        }
    },
    doesInclude: (primaryArray, validatingArray) => {
     let validateArray =  validatingArray.reduce((result, x) => {
            let doesExist = primaryArray.findIndex(y => y === x);
            result['validate'] = result['validate'] && (doesExist === -1) ? false : true;
            if (!result['validate']) {
                result['invalidFields'].push(x)
            }
            return result;
        }, { validate: true, invalidFields: [] });
        return validateArray;
    }
}

