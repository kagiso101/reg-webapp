//require all modules
let express = require('express');//to create web apps
var exphbs = require('express-handlebars');//to render templates
const bodyParser = require('body-parser');//require body parser for htm functionality
const flash = require('express-flash');
const session = require('express-session');


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/registrations';
const pool = new Pool({
    connectionString
});

var Reg = require("./reg")
//instantiate 
const reg = Reg(pool)
let app = express();

//setup handlebars ,Body-parser and public
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'my express flash string',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'));//to use css
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.get('/', async function (req, res) {

    var all = await reg.allReg()

    res.render('home', {
        regNumb: all
    })
})

app.post('/reg_numbers', async function (req, res) {

    var numb = req.body.regInput

    if (numb) {
       await reg.addReg(numb)
    }
    else{
        req.flash('error', 'please enter a registration!')
    }


    var all = await reg.allReg()

    res.render('home', {
        regNumb: all
    })


})

app.get('/reg_numbers', async function (req, res) {
    var filter = req.query.filter

    const filtering = await reg.filterReg(filter)

    res.render('home', {
        regNumb: filtering
    })
})


app.get('/clear', async function (req, res) {
    await reg.clear()
    res.render('home')
})




//Port setup
const PORT = process.env.PORT || 3002;

app.listen(PORT, function () {
    console.log('App starting on port :' + PORT);
});
