"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const index_2 = __importDefault(require("./routes/dashboard/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = __importDefault(require("./config/db"));
const date_1 = require("./utils/date");
const auth_2 = require("./middleware/auth");
const user_1 = __importDefault(require("./models/user"));
db_1.default.sync({ force: true }).then(() => {
    console.log('DB Synced');
});
dotenv_1.default.config();
const app = (0, express_1.default)();
const SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
const store = new SequelizeStore({ db: db_1.default });
// view engine setup
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use((0, connect_flash_1.default)());
app.use(async (req, res, next) => {
    res.locals.currentUser = req.session.user;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.dateTimeFormate = date_1.dateTimeFormate;
    res.locals.dateFormate = date_1.dateFormate;
    const errorMessages = req.flash('error');
    const successMessage = req.flash('success');
    res.locals.successMessage = successMessage.length > 0 ? successMessage[0] : null;
    res.locals.errorMessages = errorMessages.length > 0 ? errorMessages : null;
    if (req.session.user) {
        const usr = await user_1.default.findByPk(req.session.user.id);
        req.user = usr;
    }
    next();
});
app.use('/dashboard', auth_2.isAuth, index_2.default);
app.use('/', index_1.default);
app.use('/auth', auth_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render(req.originalUrl.indexOf('/dashboard/') === 0 ? 'dashboard/error' : 'web/error');
});
module.exports = app;
