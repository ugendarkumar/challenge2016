import 'dotenv/config';

// include dependencies

import express from 'express';
import bodyParser from 'body-parser';

// require routes

import distributorRoutes from './routes/distributor.routes';

const app = express();


//body-parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use('/distributor',distributorRoutes);



app.listen(process.env.PORT || 3000, () => {
    console.log('app listening on port 3000');
});




console.log(process.env.PORT)