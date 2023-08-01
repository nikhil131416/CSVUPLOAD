const mongoose = require('mongoose');

async function main(){
    try{
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/csv_upload');
        module.exports = db;
        console.log('**** MongoDB Connected ****')
    }
    catch(err){
        console.log("****Error in connecting to db ----> ", err);
    }
}

main();