const express = require('express');
const myConnection = require('express-myconnection');
const session = require('express-session');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

// Configura el "session store"
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: 'Alsibar01985',
    database: 'bd-sifac',
    port: 3306,
    clearExpired: true,
    checkExpirationInterval: 900000, // Intervalo de comprobación de expiración en milisegundos (15 minutos)
    expiration: 86400000, // Tiempo de expiración predeterminado en milisegundos (24 horas)
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});


//importando rutas---------------------------------------------------
const loginRoutes = require('./routes/login');


//settings------------------------------------------------------------
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'usuarios.hbs'
}));
app.set('view engine', 'hbs');

//midlewares---------------------------------------------------------
app.use(express.urlencoded({
    extended: true
}));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'Alsibar01985',
    port: 3306,
    database: 'bd-sifac'
}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: sessionStore // Usa el "session store" configurado
}));
app.use(express.static(__dirname + '/public'))
app.use('/', loginRoutes);

//rutas-------------------------------------------------------------
app.get('/', (req, res) => {
    if (req.session.loggedin == true) {
        if (req.session.cargo === 'administrador') {
        
                res.render('administrador/admin', {
                name: req.session.name,
                cargo: req.session.cargo,
                admin: 'admin'
            });
        } else if (req.session.cargo === 'cajero') {
            app.engine('.hbs', engine({
                extname: '.hbs',
                defaultLayout: 'facturacion.hbs',
            }));
            
            res.render('cajero/facturacion', {
                layout: 'facturacion.hbs',
                name: req.session.name,
                cargo: req.session.cargo,
                cajero: "cajero"
            });
        }
    } else {
        res.redirect('/login');
    }
});


// escuchando puerto------------------------------------------------------
app.listen(app.get('port'), () =>{
    console.log('server running on port ', app.get('port'))
}); 