/*  global express:true*/
/*  global PORT:true*/
/*  global fs:true*/

var app = express();
var bodyParser = require('body-parser');

PORT = process.env.PORT || 3100;

var controllers = {};
var controllersPath = process.cwd() + '/app/controllers';

fs = require('fs');

//  Get our controllers modules
fs.readdirSync(controllersPath).forEach( (file) => {
    if (file.indexOf('.js') !== -1) {
        controllers[file.split('.')[0]] = require(controllersPath + '/' + file);
    }
});

//  Use bodyparser as our express parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//  Root API
app.get('/', (req, res) => {
    return res.status(200).json({
        msg: 'Test'
    });
});
app.post('/voteOnce', controllers.voter.voteOnce);
app.post('/voteLoop', controllers.voter.voteLoop);

//  Boots server
app.listen(PORT, () => {
    console.log('Server is functional on ' + PORT + ' port on ' + process.env.NODE_ENV + " environment.");
});