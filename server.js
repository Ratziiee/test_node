const express = require('express');
const hbs = require('hbs');
const pg = ('pg');
const Pool = require('pg-pool');
const app = express();

app.set('port',process.env.PORT || 3001);
var connString = "postgres://postgres:admin@localhost:5432/postgres";
const config =
    {
    user: 'postgres_11x',
    database: 'aeroGMS',
    password: 'postgres_11x',
        host:'aerogms.czb0ha2nucbq.ap-south-1.rds.amazonaws.com',
    port: 5432,
    max : 20,
    idleTimeoutMillis: 10000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000
};

 var pool = new Pool(config);

app.get('/', (req,res,next) => {

   // res.status(200).send("working");

    pool.connect((err,client,done) => {
        if(err)
        {
            console.log('error '+err);
            res.send(err);
        }
        else
        {
            console.log('connected');
           // res.send('connected');
              client.query('select * from demo',(err,result) => {
             //client.query('INSERT INTO public.test(id, name, age) VALUES (7, \'praveen kumar\', 98);',(err,result) => {
                 done();
                 if(err)
                 {
                     console.log('checking error : '+err)
                 }
                 else
                 {
                     console.log(result.rows);
                     res.send(result.rows);

                 }
             });
        }
    });
});


hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'));


app.use((req,res,next) => {
   var now = new Date().toString();

   console.log(`${now}:`)
   next();
});

app.use((req,res,next) =>{
    res.render('maintain.hbs');
    //console.log('dkdkd')
    //next();
});

hbs.registerHelper('getCurrentYear', () => {
   return new Date()
});

var json = {
    name : 'rajat',
    age : 24,
    likes : [
        'programming',
        'hacking'
    ]
};

var error_obj = {
  error : "Error handling request"
};

// app.get('/', (req,res)  => {
// //res.send('<h1>hello express!</h1>');
//     res.send(json)
//
// });

app.get('/about', (req,res) => {
    res.render('about.hbs',{
        title : 'About Page',
        currentYear : new Date().getFullYear()
    });
});

app.get('/', (req,res) =>{
   res.render('home.hbs',{
      title : "Homepage" ,
       pageHeader : "Welcome",
       pagePara : "Welcome to my page",
       currentYear : new Date().getFullYear()

   });
});


app.get('/bad', (req,res) => {

    res.send(error_obj);
});

app.listen(app.get('port'),(err, result) => {
    if(err)
    {
        console.log(err);
    }
    else {
        console.log('Listening to 3001')
    }
});
