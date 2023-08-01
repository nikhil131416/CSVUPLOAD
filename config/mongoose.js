const mongoose = require('mongoose');

async function main(){
    try{
        const db = await mongoose.connect('mongodb+srv://pankaj3112:udPAnOOdZKwZxo5w@cluster0.lm6iyo2.mongodb.net/?retryWrites=true&w=majority');
        module.exports = db;
        console.log('**** MongoDB Connected ****')
    }
    catch(err){
        console.log("****Error in connecting to db ----> ", err);
    }
}

main();


