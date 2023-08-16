const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nikunj05108@gmail.com',
        pass: "urvwrkofnjpkiwos"
    }
});
 


// exports.signup = (req, res) => {
//     console.log(req.body);
//     const { name, email, password } = req.body

//     User.findOne({email}).then(user => {
//         if(user) {
//             return res.status(400).json({
//                 error : 'Email is taken'
//             })
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     })
    

//     let newUser = new User({name, email, password})

//     newUser.save()
//     .then(n => 
//         {
//             if(err) {
//                 console.log('SIGN UP ERROR',err);
//                 return res.status(400).json({
//                     error : err
//                 })
//         }
        
//         res.json({
//             message : 'Signup Success!'
//         })
//     })
//     .catch(err => console.log(err))
// }


exports.signup = (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body

    User.findOne({email}).then(user => {
        if(user) {
            return res.status(400).json({
                error : 'Email is taken'
            })
        }
    })
    .catch((err) => {
        console.log(err);
    })
    
    const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn : '10m'})
    
    let mailDetails = {
        from: 'nikunj05108@gmail.com',
        to: email,
        subject: 'Activation Link',
        text: `${process.env.CLIENT_URL}/auth/activate/${token}`
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

    
}

exports.accountActivation = (req, res) => {
    const { token } = req.body

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err) {
                console.log(err);
                return res.status(401).json({
                    error : 'Expired Link'
                })
            }

            const {name, email, password } = jwt.decode(token)

            let newUser = new User({name, email, password})

            newUser.save()
            .then(data => 
                {
                res.json({
                    message : 'Signup Success!'
                })
            })
            .catch(err => {
                    console.log('SIGN UP ERROR',err);
                    return res.status(400).json({
                        error : err
                    })
            })
        })
    }
}

exports.signin = (req, res) => {
    const {email, password } = req.body

    User.findOne({email}).then((user) => {
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error : 'Passwords do not match'
            })
        }
        const token = jwt.sign({ _id : user._id }, process.env.JWT_SECRET, {expiresIn : '7d'})
        const { _id, name, email, role } = user

        return res.json({
            token,
            user : { _id, name, email, role }
        })
    })
    .catch(err => {
        return res.status(400).json({
            error : 'Not Found'
        })
    })


}