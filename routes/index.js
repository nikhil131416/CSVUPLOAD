const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const fileController = require('../controllers/file_controller')

router.get('/', homeController.home);

router.post('/add', fileController.uploadCSV);

router.get('/delete/:id', fileController.deleteCSV);

router.get('/display/:id', fileController.displayCSV);

module.exports = router;