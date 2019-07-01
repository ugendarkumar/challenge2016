import express from 'express';
import bcrypt from 'bcrypt-nodejs';

import helper from '../helpers/helper';

// controllers
import distributorController from '../controllers/distributor.controller';



const distributorRouter = express.Router();

distributorRouter.get('/getCountries', async (req, res) => {
    try {
        let data = await distributorController.getCountries();
        res.status(200).json({ data: data, message: 'Retrived countries successfully' });
    } catch (e) {
        res.status(400).json({ message: 'Internal server error' });
    }
});


distributorRouter.post('/createDistributor', helper.isAuthorized, async (req, res) => {
    try {
        let requiredInputs = ['distributorName', 'countryCode', 'cityCode', 'excludeCountry', 'excludeCity'];
        let isValidInput = helper.requiredFields(req.body, requiredInputs);
        if (!isValidInput) {
            return res.status(400).send('Required fields missing');
        }
        let data = await distributorController.createDistributor(req, res);
        res.status(data.status).json({ message: data.message });
    } catch (e) {
        if (e.status === 401) return res.json({ message: err.message })
        res.status(400).json({ message: 'Internal server error' });
    }
});

distributorRouter.post('/subDistributor', helper.isAuthorized, async (req, res) => {
    try {
        let requiredInputs = ['distributorName', 'countryCode', 'cityCode', 'excludeCountry', 'excludeCity', 'subDistributor'];
        let isValidInput = helper.requiredFields(req.body, requiredInputs);
        if (!isValidInput) {
            return res.status(400).send('Required fields missing');
        }
    let data = await distributorController.subDistributor(req,res);
    res.status(200).json({message:data})
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Internal server error' });
    }
})


export default distributorRouter;
