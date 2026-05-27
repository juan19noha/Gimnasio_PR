const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const pool = require('./db');

// Serialización
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE PK_id_usuario = ?', [id]);
        done(null, rows[0]);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE correo = ?', [profile.emails[0].value]);
        
        if (rows.length > 0) {
            // Usuario existe, actualizar datos de Google si es necesario
            return done(null, rows[0]);
        }
        
        // Crear nuevo usuario con rol de cliente (3)
        const [result] = await pool.query(`
            INSERT INTO Usuarios (FK_id_rol, nombre, apellido, correo, password, tipo_documento)
            VALUES (3, ?, ?, ?, 'oauth_google', 'CC')
        `, [profile.name.givenName, profile.name.familyName, profile.emails[0].value]);
        
        const [newUser] = await pool.query('SELECT * FROM Usuarios WHERE PK_id_usuario = ?', [result.insertId]);
        done(null, newUser[0]);
    } catch (error) {
        done(error, null);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE correo = ?', [email]);
        
        if (rows.length > 0) {
            return done(null, rows[0]);
        }
        
        const [result] = await pool.query(`
            INSERT INTO Usuarios (FK_id_rol, nombre, apellido, correo, password, tipo_documento)
            VALUES (3, ?, ?, ?, 'oauth_facebook', 'CC')
        `, [profile.name.givenName || 'Usuario', profile.name.familyName || 'Facebook', email]);
        
        const [newUser] = await pool.query('SELECT * FROM Usuarios WHERE PK_id_usuario = ?', [result.insertId]);
        done(null, newUser[0]);
    } catch (error) {
        done(error, null);
    }
}));

// Instagram Strategy
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/instagram/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.id}@instagram.com`;
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE correo = ?', [email]);
        
        if (rows.length > 0) {
            return done(null, rows[0]);
        }
        
        const [result] = await pool.query(`
            INSERT INTO Usuarios (FK_id_rol, nombre, apellido, correo, password, tipo_documento)
            VALUES (3, ?, ?, ?, 'oauth_instagram', 'CC')
        `, [profile.displayName || 'Usuario', 'Instagram', email]);
        
        const [newUser] = await pool.query('SELECT * FROM Usuarios WHERE PK_id_usuario = ?', [result.insertId]);
        done(null, newUser[0]);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;