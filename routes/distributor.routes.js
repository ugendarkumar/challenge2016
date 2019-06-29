import express from 'express';

// controllers
import distributorController from '../controllers/distributor.controller';


const distributorRouter = express.Router();

distributorRouter.get('/check',(req,res) => {
    let data = distributorController.check();
    
    
});

export default distributorRouter;
