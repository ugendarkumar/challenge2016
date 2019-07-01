import path from 'path';
import helper from '../helpers/helper';
import csv from 'csvtojson';
import fs from 'fs';

let countriesFile = `cities.csv`;



const distrbutorController = {
    getCountries: async () => {
        try {
            const jsonArray = await csv().fromFile(countriesFile);
            return jsonArray;
        } catch (e) {
            return e;
        }
    },
    createDistributor: async (req,res) => {
        try {
          let data = await fs.readFileSync('distributor.json','utf-8');
            data = JSON.parse(data);
            let doesExist = data['data'].findIndex(x => x.distributorName == req.body.distributorName);
            if(doesExist !== -1){
                return {status:400,message:'Distributor already exist'};
            }
            let distributor = {
                distributorName: req.body.distributorName,
                countryCode: req.body.countryCode,
                cityCode: req.body.cityCode,
                excludeCountry:req.body.excludeCountry,
                excludeCity:req.body.excludeCity
            }
            data['data'].push(distributor);
            data = JSON.stringify(data);
            let saveData = fs.writeFileSync('distributor.json',data);
            return {status:200,message:'Distributor saved successfully'}

        } catch (e) {
         throw e
        }
    },
    subDistributor:async(req,res) => {
        try{
            const countryData = await csv().fromFile(countriesFile);
            let data = await fs.readFileSync('distributor.json','utf-8');
            data = JSON.parse(data);
            let distributerExist = data['data'].findIndex(x => x.distributorName == req.body.distributorName);
            if(distributerExist === -1){
                return {status:400,message:'Distributor not found'};
            }        
            let distributingCountry = [...data['data'][distributerExist]['countryCode']];
            let notdistributingCountry = [...data['data'][distributerExist]['excludeCountry']];
            let distributingCity =  [...data['data'][distributerExist]['cityCode']];
            let notdistributingCity = [...data['data'][distributerExist]['excludeCity']];                 
            distributingCountry = await helper.doesInclude(distributingCountry,[...req.body.countryCode]);
            notdistributingCountry = await helper.doesInclude(notdistributingCountry,[...req.body.countryCode]);
            distributingCity = await helper.doesInclude(distributingCity,[...req.body.cityCode]);
            notdistributingCity =  await helper.doesInclude(notdistributingCity,[...req.body.cityCode]);
           // check whether the city is part of the country 
            let cityData;
            if(!notdistributingCity.validate) {
                cityData = countryData.reduce((acc,x) => {
                let isEqual = notdistributingCity['invalidFields'].some(val => val === x['City Code']);
                if(isEqual){
                   let checkCountry = [...data['data'][distributerExist]['countryCode']].findIndex(z => z === x['Country Code']);
                   if(checkCountry !== -1 &&  acc.indexOf(x['City Code']) ===-1){
                    acc.push(x['City Code']);
                   }
                }
                return acc;
            },[])
            }

        
            return {distributingCountry:distributingCountry,
                notdistributingCountry:notdistributingCountry,
                distributingCity:distributingCity,
                notdistributingCity:notdistributingCity,
                cityData:cityData}    
        }catch(e){
            throw e
        }
    }
}


export default distrbutorController;