const express =  require('express');
const controller = require('../controller/controller.js')
var bodyParser = require('body-parser')
const router = express.Router();
  // getting form data using body parser
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));


router.get("/",controller.getData );    
router.post("/home", controller.postData);


router.get('/login',controller.getlogin)
router.post("/login", controller.postlogin);

// homepage get
router.get('/homepage.html', function (req, res) {
  res.sendFile(__dirname + '/homepage.html');
   });

     module.exports = router; 