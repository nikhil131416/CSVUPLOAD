const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const CSV = require('../models/csv');


module.exports.uploadCSV = async function(req, res){
    if(req.files && req.files.csvfile && req.files.csvfile.mimetype == "text/csv"){
        let file = req.files.csvfile;
        let filename = file.name;
        let uploadpath = path.join(__dirname, '../uploads/csv', Date.now()+filename);

        file.mv(uploadpath, async function(err){
            if(err){
                console.log("File Upload Failed---->", filename, err);
            }
            else {
                let csv = await CSV.create({
                    filename: filename,
                    filepath: uploadpath
                });

                if(!csv){
                    console.log("Error in creating csv file");
                }
                else {
                    console.log("File Uploaded Succesfully--->", filename);
                }
            }
        });
    }
    
    return res.redirect('back');
}


module.exports.deleteCSV = async function(req, res){
    try {
        let id = req.params.id;
        let csv = await CSV.findById(id);
        if(csv){
            csv.deleteOne();
            fs.unlinkSync(csv.filepath);
            console.log("File Deleted Successfully--->", csv.filename);
        }
    }
    catch(err){
        console.log("Error in deleting csv file---->", err);
        return res.redirect('back');
    }

    return res.redirect('back');
}


module.exports.displayCSV = async function(req, res){

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let id = req.params.id;
        let csv = await CSV.findById(id);
        if(csv){
            let data = [];
            let header = [];

            fs.createReadStream(csv.filepath)
            .pipe(csvParser({ separator: ',' }))
            .on('headers', (headers) => {
                headers.map((head) => {
                    header.push(head);
                });
            })
            .on('data', (row) => data.push(row))
            .on('end', () => {

                let pageInfo = {};

                if(startIndex > 0){
                    pageInfo.prev = page - 1;
                }
                
                if(endIndex < data.length){
                    pageInfo.next = page + 1;
                }

                pageInfo.total = Math.ceil(data.length / limit);
                pageInfo.current = page;

                
                data = data.slice(startIndex, endIndex);

                return res.render('viewcsv.ejs', {
                    title: `CSV Reader | ${csv.filename.substring(0, csv.filename.lastIndexOf('.'))}`,
                    id: id,
                    filename: csv.filename,
                    csv: csv,
                    header: header,
                    data: data,
                    pageInfo: pageInfo
                });
            });
        }
    }
    catch(err){
        console.log("Error in displaying csv file---->", err);
        return res.redirect('back');
    }
}