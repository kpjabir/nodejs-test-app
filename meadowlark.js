// list requirements and dependencies

var fortune = require('./lib/fortune.js');
var formidable = require('formidable');
var express = require('express');
var app = express();

// disable X-Powered-By header forwarder
app.disable('x-powered-by');

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout:'main',
		helpers: {
			section: function(name, options){
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}	
		}
	});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//////////////////////////////////////////////

// Set /le5
app.set('port', process.env.PORT || 3000);

//////////////////////////////////////////////

// add middleware

// Static middleware
app.use(express.static(__dirname + '/public'));

// URL-encoded body parser
app.use(require('body-parser')());


//////////////////////////////////////////////

// Detect test=1
app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});

/////////////////////////////////////////////

// page routes

// Home page
app.get('/', function(req, res) {
	res.render('home');
});

// About page
app.get('/about', function(req, res) {
        res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

// Contact page
app.get('/contact', function(req, res) {
        res.render('contact');
});

////////////////////////////////////////////

// Tour pages
// Hood river tour
app.get('/tours/hood-river', function(req, res) {
        res.render('tours/hood-river');
});


// Oregon Coast tour
app.get('/tours/oregon-coast', function(req, res) {
        res.render('tours/oregon-coast');
});

// Request group rate
app.get('/tours/request-group-rate', function(req, res) {
        res.render('tours/request-group-rate');
});

///////////////////////////////////////////

// Nursery rhyme routes
app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});

// Weather widget partial view
app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
	next();
});

// Form handler
app.get('/contest/vacation-photo', function(req, res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year: now.getFullYear(),month:now.getMont()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303, '/thank-you');
	});
});

///////////////////////////////////////////

// Error pages
// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
        res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
        console.error(err.stack);
	res.status(500);
	res.render('500');
});

/////////////////////////////////////////////

// Request object's header
app.get('/headers', function(req,res){
	res.set('Content-Type','text/plain');
	for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});

/////////////////////////////////////////////

// Weather widget function
function getWeatherData() {
	return {
		locations: [
			{
				name: 'Portland',
				forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},
                        {
                                name: 'Bend',
                                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                                weather: 'Partly Cloudy',
                                temp: '55.0 F (12.8 C)',
                        },
                        {
                                name: 'Manzanita',
                                forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
                                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                                weather: 'Light Rain',
                                temp: '55.0 F (12.8 C)'
                        },
		],
	};
}	

/////////////////////////////////////////////

//Form Handling
app.get('/newsletter', function(req, res){
	//CSRF is dummy value for now
	res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank-you');
});

app.post('/process', function(req, res){
	if(req.xhr || req.accepts('json,html')==='json'){
		//if error, send {error: 'error desctiption'}
		res.send({ success: true });
	} else {
		//if error, redirect to error page
		res.redirect(303, '/thank-you');
	}
});

/////////////////////////////////////////////

// set listener
app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + 
	app.get('port') + '; pressn Ctrl-C to terminate.');
});
