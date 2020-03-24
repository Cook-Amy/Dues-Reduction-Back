const pncFiles = "../savedFiles/PncFiles/";
const wcFiles = "../savedFiles/WcFiles/";
const cfFiles = "../savedFiles/CfFiles/";
const adminFiles = "../savedFiles/AdminFiles/";
const fs = require("fs");

/**************************************************************************
 * Save Files
**************************************************************************/
function savePncFile(req, res) {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');
  fs.writeFile(pncFiles + file.name, base64data, 'base64', (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.set("Location", pncFiles + file.name);
      res.status(200);
      res.send(file);
    }
  });
}

function saveWcFile(req, res) {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');
  fs.writeFile(wcFiles + file.name, base64data, 'base64', (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.set("Location", wcFiles + file.name);
      res.status(200);
      res.send(file);
    }
  });
}

function saveCfFile(req, res) {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');
  fs.writeFile(cfFiles + file.name, base64data, 'base64', (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.set("Location", cfFiles + file.name);
      res.status(200);
      res.send(file);
    }
  });
}

function saveAdminFile(req, res) {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');
  fs.writeFile(adminFiles + file.name, base64data, 'base64', (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.set("Location", adminFiles + file.name);
      res.status(200);
      res.send(file);
    }
  });
}

/**************************************************************************
 * Delete Files
**************************************************************************/
function deletePncFile(req, res) {
  const fileName = req.url.substring(7).replace(/%20/g, ' ');
  fs.unlink(pncFiles + fileName, (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.status(200);
      res.send({});
    }
  });
}

function deleteWcFile(req, res) {
  const fileName = req.url.substring(7).replace(/%20/g, ' ');
  fs.unlink(wcFiles + fileName, (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.status(200);
      res.send({});
    }
  });
}

function deleteCfFile(req, res) {
  const fileName = req.url.substring(7).replace(/%20/g, ' ');
  fs.unlink(cfFiles + fileName, (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.status(200);
      res.send({});
    }
  });
}

function deleteAdminFile(req, res) {
  const fileName = req.url.substring(7).replace(/%20/g, ' ');
  fs.unlink(adminFiles + fileName, (err) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.status(200);
      res.send({});
    }
  });
}

module.exports = {
  savePncFile: savePncFile,
  saveWcFile: saveWcFile, 
  saveCfFile: saveCfFile,
  saveAdminFile: saveAdminFile,
  deletePncFile: deletePncFile,
  deleteWcFile: deleteWcFile,
  deleteCfFile: deleteCfFile,
  deleteAdminFile: deleteAdminFile
}