


const Sib=require('sib-api-v3-sdk');
require('dotenv').config();
const uuid = require('uuid');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User=require('../models/Signup');
const Forgotpassword = require('../models/forgotpassword');
require('dotenv').config();


const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        console.log('EMAIL',user);
        if(user){

            const id = uuid.v4();
const client=Sib.ApiClient.instance;
let apiKey=client.authentications['api-key'];
apiKey.apiKey=process.env.API_KEY;

const transEmailAPi= new Sib.TransactionalEmailsApi()
const sender={
    email:'prabhatsingh5725@gmail.com',
    name:'Prabhat'
}
const receivers=[
    {
        email:email
    },
]

await transEmailAPi.sendTransacEmail({
    sender,
    to:receivers,
    subject:'Verification',
    textContent:'Click on reset',
    htmlContent:`<a href="http://localhost:4000/password/resetpassword/${id}">http://localhost:4000/password/resetpassword/${id}</a>`
})

      
           await  Forgotpassword.create({ id:id , active: true,UserId:user.id })      
      res.status(201).json({message: 'Link to reset password sent to your mail ', sucess: true})
        }

        else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    try{
        const id =  req.params.id;
        const forgotpasswordrequest= Forgotpassword.findOne({ where : { id }})
             if(forgotpasswordrequest){
                 res.status(200).send(`<html>
                 <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <title>Update Password</title>
               </head>                     
                                        <body>
                                         <form action="/password/updatepassword/${id}" method="get">
                                             <label for="newpassword">Enter New password</label>
                                             <input name="newpassword" id="name" type="password" required></input>
                                             <button id="reset">reset password</button>
                                         </form>

                                         <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.23.0/axios.js"></script>
                                         <script>
                                         const reset=document.getElementById('reset');
                                         reset.addEventListener('click',updatePassword);

                                          async function updatePassword(e){
                                                 e.preventDefault();
                                                 const pass=document.getElementById('name').value;
                                                 const obj={
                                                    newpassword:pass
                                                 }
                                                 console.log(obj);
                            const res=await axios.post("http://localhost:4000/password/updatepassword/${id}",obj)  
                            console.log(res);           
                                               alert(res.data.msg);
                                             }
                                         </script>   
                                     </body>    
                                     </html>`
                                     )  
    }
    res.end()
        }
        catch(err){
            console.log(err)
            res.json({ error: err, sucess: false });
            
        }
    
}

const updatepassword = async(req, res) => {

    try {
        const  newpassword  = req.body.newpassword;
        const { id } = req.params;
        console.log("34224323442342343",newpassword,id);
 let forgotuser =await Forgotpassword.findOne({ where : { id: id }});
 console.log("forgot",forgotuser);
    if(forgotuser.active==false){
        return res.status(201).json({msg:'Link Expired'})
    }
    
    let user=await User.findOne({where: { id : forgotuser.UserId}});
                console.log('userDetails', user)
                if(user) {
                    const salt = 10;

                        bcrypt.hash(newpassword, salt, async(err, hash)=> {
                            // Store hash in your password DB.
                            if(err){
                              
                                throw new Error(err);
                            }
                           await user.update({ password: hash });
                      const f= await forgotuser.update({active:false})
                            })
            

                            res.status(201).json({msg: 'Successfuly update the new password'})
 

            } else{
              
                 res.status(404).json({ error: 'No user Exists', success: false})
            }

    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

exports.updatePassword = async (req, res) => {
    try {
        const id = req.params.id

        const newPassword = req.body.npassword

        // console.log(newPassword, id)

        let forgetTable = await ForgetPasswordtable.findOne({ where: { id: id } })

        if (forgetTable.isActive === false) {
            return res.status(201).json({ msg: 'Link expired' })
        }

        let user = await SinUp.findOne({ where: { id: forgetTable.sinupId } })

        const saltrounds = 10;
        bcrypt.hash(newPassword, saltrounds, async (err, hash) => {
            console.log(err)
            await user.update({
                passWord: hash
            })
        })

        await forgetTable.update({ isActive: false })
        res.status(201).json({ msg: 'Updated new password' })

    } catch (err) { console.log(err) }


}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}