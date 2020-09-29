

exports.getDashboard = (req, res, next) => {
    try {
        res.render('admin/index', {
            headTitle: 'Dashboard'
        });
    } catch (e) {
        console.log(e);
    }
};
