
const handlebars = require('express-handlebars');
const express = require('express')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extends:false}));
require('./router/router')(app);


const perm = handlebars.create({defaultLayout:'main',runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
},
})


app.engine('handlebars',perm.engine);

app.set('view engine', 'handlebars');
app.use('/', express.static(__dirname + '/'));



app.listen(3000,()=>{
    console.log('Servidor localhost:3000/')
})