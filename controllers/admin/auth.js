const bcrypt = require('bcryptjs');
const User = require('../../models/user');

exports.getLogin = (req, res, next) => {
    res.render('admin/auth/login');
};

exports.postLogin = (req, res, next) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        User.findOne({ mobile }).then(user => {
            if (!user) {
                return res.status(422).render('admin/auth/login')
            }
            bcrypt.compare(password, user.password).then(doMatch => {
               if(doMatch) {
                   req.session.isLoggedIn = true;
                   req.session.user = user;
                   return req.session.save(err => {
                       console.log(err);
                       res.redirect('/admin');
                   });
               }
               return res.status(422).render('admin/auth/login')
            });
        });
        res.send({
            user,
            mobile,
            password
        });
    } catch (e) {
        console.log(e);
    }
};
