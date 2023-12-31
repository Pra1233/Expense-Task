const express=require('express');

const resetpasswordController=require('../controllers/forgotcontroller');
const router=express.Router();


router.post('/updatepassword/:id', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword', resetpasswordController.forgotpassword)


module.exports = router;

