const fileModel = require('../model/fileModel');

function getFiles(req, res) {
  var venueID = req.query.venueID;

  fileModel.getFilesFromDB(venueID, (error, result) => {
    if(error) {
      console.log('Error in file callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No file info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function removeFile(req, res) {
  var fileID = req.body.fileID;
  var venueID = req.body.venueID;

  fileModel.removeFileFromDB(fileID, venueID, (error, result) => {
    if(error) {
      console.log('Error in file callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No file info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

function saveFile(req, res) {
  var file = req.body.file;

  fileModel.saveFileInDB(file, (error, result) => {
    if(error) {
      console.log('Error in file callback');
      console.log(error);
    }
    else if(result.length == 0) {
      console.log("No file info found in DB. Returning with null.");
      res.status(204).json(null);
      res.end();
    }
    else {
      res.status(200).json(result);
      res.end();
    }
  });
}

module.exports = {
  getFiles: getFiles,
  removeFile: removeFile,
  saveFile: saveFile
}