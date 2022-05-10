import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import User from '../../models/user';


export const all: RequestHandler = async (req, res, next) => {
    try {
        const users = await User.findAll({});
        res.render('dashboard/users', { title: 'News and Stories', users });
    } catch (e) {
        next(e);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {
        res.render('dashboard/users/form', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
};

export const save: RequestHandler = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email
            }
            return res.status(400).render('dashboard/users/form', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        
        await User.create({
            firstName,
            lastName,
            email,
            password
        });
        req.flash('success','New user created successfully!');
        res.redirect('/dashboard/users');
    } catch (e) {
        // console.log(e);
        next(e);
    }
};

export const edit: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (user) {
            res.render('dashboard/users/form', { title: 'News and Stories', user });
        } else {
            next(new Error('Tag not found!'));
        }
    } catch (e) {
        next(e);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);

        if (user && req.user) {
            if (+userId === req.user.id) {
                throw new Error('You cannot edit yourself in here!');
            }
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const inputValues = {
                    firstName,
                    lastName,
                    email
                }
                return res.status(400).render('dashboard/users/form', { title: 'News and Stories', user, inputValues, errorMessages: errors.array() });
            }
    
            await User.update({
                firstName,
                lastName,
                email
            }, {
                where: {
                    id: userId
                }
            });
            req.flash('success','User updated successfully!');
            res.redirect('/dashboard/users');
        } else {
            next(new Error('User not found!'));
        }
    } catch (e) {
        next(e)
    }
};

export const destroy: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        if (req.user && +userId === req.user.id) {
            req.flash('error','You cannot delete yourself in here!');
            return res.json({ message: 'You cannot delete yourself in here!', status: 403 });
        }
        
        const user = await User.findByPk(userId);
        if (user) {
            await User.destroy({ where: { id: userId }, individualHooks: true });
            req.flash('success','User deleted successfully!');
            res.json({ message: 'Deleting user succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'User not found!', status: 404 });
        }
    } catch (e) {
        next(e);
    }
};

export const profileView: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user;
        res.render('dashboard/settings/profile', { title: 'News and Stories', user });
    } catch (e) {
        next(e);
    }
}

export const profileSave: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const about = req.body.about;
        const facebookUrl = req.body.facebookUrl || '';
        const instagramUrl = req.body.instagramUrl || '';
        const twitterUrl = req.body.twitterUrl || '';
        const linkedInUrl = req.body.linkedInUrl || '';
        const githubUrl = req.body.githubUrl || '';
        const youtubeUrl = req.body.youtubeUrl || '';
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email,
                phoneNumber,
                about,
                facebookUrl,
                instagramUrl,
                twitterUrl,
                linkedInUrl,
                githubUrl,
                youtubeUrl,
            }
            return res.status(400).render('dashboard/settings/profile', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        const user = await User.update({
            firstName,
            lastName,
            email,
            phoneNumber,
            about,
            facebookUrl,
            instagramUrl,
            twitterUrl,
            linkedInUrl,
            githubUrl,
            youtubeUrl,
            avatar: image ? image.path.replace('public', '') : undefined,
        }, {
            where: {
                id: req.user.id
            },
            returning: true,
            // plain: true
        });
        console.log('user', user);
        // req.session.user = user[1];
        req.flash('success', 'User information successfully changed!');
        res.redirect('/dashboard/settings/profile');
    } catch (e) {
        next(e);
    }
}


export const changePasswordView: RequestHandler = async (req, res, next) => {
    try {
        res.render('dashboard/settings/change-password', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
}
export const changePasswordSave: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});

        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('dashboard/settings/change-password', { title: 'News and Stories', errorMessages: errors.array() });
        }

        try {
            const validPassword = await User.checkPassword(req.user.id as number, currentPassword);
            if (validPassword) {
                await User.update({
                    password: newPassword
                }, {
                    where: {
                        id: req.user.id
                    }
                });
                req.flash('success', 'Password successfully changed!');
                res.redirect('/dashboard/settings/change-password');
            }
        } catch (er: any) {
            req.flash('error', er.toString());
            res.redirect('/dashboard/settings/change-password');
        }
        
    } catch (e) {
        next(e);
    }
}


export const deleteAccount: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});

        await User.destroy({ where: { id: req.user.id }, individualHooks: true});
        req.flash('success','User deleted successfully!');
        req.session.isLoggedIn = false;
        req.session.user = null;
        req.user = null
        res.json({ message: 'Deleting category succeed!', status: 204 });
    } catch (e) {
        next(e);
    }
};