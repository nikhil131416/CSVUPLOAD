const CSV = require('../models/csv');

module.exports.home = async function(req, res){
    let csvs = await CSV.find({});
    return res.render('home', {
        title: "CSV Reader | Home",
        files: csvs
    });
}