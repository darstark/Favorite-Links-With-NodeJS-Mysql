//esta libreria permite hacer auth con redes sociales EJ: facebook gmail twitter etc
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

//login
passport.use('local.signin', new LocalStrategy ( {
    usernameField: 'username',
    passwordField: 'password',
    // el passreqtocallback es necesario si quiero pasar otros datos en el login
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(req.body);
    if(rows.length>0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success','Welcome'+ user.username));
        }else{
            done(null, false, req.flash('message','Incorrect Password'));
        }
    }else{
        return done(null, false, req.flash('message','The user does´nt exists'))
    }
}));
//register
passport.use('local.signup', new LocalStrategy ( {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { fullname } = req.body;
    const newUser = {
        //esta linea de abajo son lo mismo ya que poseen el mismo nombre y esto es js con em6
        // username: username
        username,
        password,
        fullname

    };
    //ciframos la contraseña 
    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    // estas lineas de abajo son para almacenar la session del usuario registrado 
    newUser.id = result.insertId;
    return done(null, newUser);
    // console.log(result);
}));

passport.serializeUser((user, done) => {
    done(null,user.id);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    // esta consulta debe tener un solo resultado y por eso tomamos el valor 0 de row 
    done(null, rows[0]);
});

