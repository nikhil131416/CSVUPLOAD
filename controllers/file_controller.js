const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const CSV = require('../models/csv');

// method to add a csv file
module.exports.uploadCSV = function(req, res){
    //restricting to only csv files by checking the mimetype of file
    if(req.files && req.files.csvfile && req.files.csvfile.mimetype == "text/csv"){
        let file = req.files.csvfile;
        let filename = file.name;
        let uploadpath = path.join(__dirname, '../uploads/csv', Date.now()+filename);

        //file.mv is used to move a file to a specific directory
        //i have used fileUpload library instead of multer
        file.mv(uploadpath, async function(err){
            if(err){
                req.flash("error" ,'Error in Uploading file');
                console.log("File Upload Failed---->", filename, err);
                return res.redirect('back');
            }
            else {
                //if fileupload is successfull, we are adding path of file to the database
                let csv = await CSV.create({
                    filename: filename,
                    filepath: uploadpath
                });

                if(!csv){
                    req.flash("error" ,'Error in Uploading file');
                    console.log("Error in creating csv file");
                    return res.redirect('back');
                }
                else {
                    req.flash("success" ,'File Uploaded Successfully');
                    console.log("File Uploaded Succesfully--->", filename);
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash("error", 'Please upload a csv file');
        res.redirect('back');
    }
}


//method to delete a file from both uploads directory as well as database
module.exports.deleteCSV = async function(req, res){
    try {
        let id = req.params.id;
        //finding document by id
        let csv = await CSV.findById(id);

        // if found 
        if(csv){
            //delete from db and also remove from the uploads directory
            csv.deleteOne();
            fs.unlinkSync(csv.filepath);

            console.log("File Deleted Successfully--->", csv.filename);
            req.flash("success" ,'File Deleted Successfully');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash("error" ,'Error in deleting file');
        console.log("Error in deleting csv file---->", err);
        return res.redirect('back');
    }
}


//method to display csv files in tabular form,
//data is paginated to show only 100 rows on a page
module.exports.displayCSV = async function(req, res){

    try {
        //if we get page and limit from query we use that else we provide 1st page with 100 rows
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let id = req.params.id;
        let csv = await CSV.findById(id);
        if(csv){
            let data = [];
            let header = [];
            
            //using csv parser to parse csv file to json format and storing it in a array
            fs.createReadStream(csv.filepath)
            .pipe(csvParser({ separator: ',' }))
            .on('headers', (headers) => {
                headers.map((head) => {
                    header.push(head);
                });
            })
            .on('data', (row) => data.push(row))
            .on('end', () => {

                //we are sending current, next, prev and total pages in pageinfo
                let pageInfo = {};

                if(startIndex > 0){
                    pageInfo.prev = page - 1;
                }
                
                if(endIndex < data.length){
                    pageInfo.next = page + 1;
                }

                pageInfo.total = Math.ceil(data.length / limit);
                pageInfo.current = page;

                //slicing data to show only 100 rows on a page
                data = data.slice(startIndex, endIndex);
                
                //sending data to veiws and rendering it
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
        req.flash("error" ,'Error in displaying file');
        return res.redirect('back');
    }
}

