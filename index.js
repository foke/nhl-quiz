(function(){

// ##### CONFIGURATION ##### //

	var express 	= require("express"),
		logfmt 		= require("logfmt"),
		mongoose 	= require('mongoose'),
		db, schemaQuiz, schemaQuestion, Quiz, app, port;


// ##### DATABASE CONNECTION ##### //
	db = mongoose.connect(process.env.MONGODB_URI);

	// schemas
	schemaQuestion = new mongoose.Schema({
			question: String,
			answer: String			
	}, { versionKey: false });

	schemaQuiz = new mongoose.Schema({
		title: String,
		updated: String,
		questions: [schemaQuestion]
	}, { versionKey: false });

	// create model
	Quiz = mongoose.model('Quiz', schemaQuiz);


	Quiz.find(function(err, questions) {	
		if (err) {
			console.log(err);
		}
	});	

// ##### WEB APP SETUP ##### //
	app = express();

	app.configure(function(){
		app.use(logfmt.requestLogger());
		app.use(express.compress()); // gzip
		app.use('/static', express.static(__dirname + '/static'));
	});

	app.get('/', function(req, res) {
		res.sendfile('static/index.html');	
	});

	app.get('/quiz', function(req, res) {		
		Quiz.find({}, 'title updated _id', function(err, data) {
			if (err) {
				console.log(err);
			}

			// return all questions in JSON format
			res.json(data);
		});		
	});

	app.get('/quiz/:id', function(req, res) {		
		Quiz.findOne({_id : req.params.id}, 'title updated _id questions', function(err, data) {			
			var json = data.toObject(),
				answers = [], 
				answersCopy, options, i;

			// 1.add all answers to array and remove from original data
			for (i = 0; i < json.questions.length; i++) {
				answers.push(json.questions[i].answer);

				delete json.questions[i].answer;
			}

			// 2.for each answer:
			for (i = 0; i < json.questions.length; i++) {
				//1.deep copy array
				answersCopy = answers.slice(0);

			   	//2.remove current answer
			   	answersCopy.splice(i, 1);

			   	//3.shuffle array
			   	answersCopy = shuffle(answersCopy);

			   	//4.create new array with self and 3 first elements
			   	options = [data.questions[i].answer, answersCopy[0], answersCopy[1], answersCopy[2]];

			   	//5.shuffle new array
			   	options = shuffle(options);

			   	//6.append to some kind of json....
			   	json.questions[i].options = options;

			}

			// 3.shuffle questions
			json.questions = shuffle(json.questions);
						   			
			// return all questions in JSON format
			res.json(json);
		});		
	});

	app.get('/quiz/question/:id', function(req, res) {
		Quiz.findOne({'questions._id': req.params.id}, {'questions.$': 1}, function(err, data) {	
			if (err) {
				console.log(err);
			}

			res.json(data.questions[0].question);
		});
	});

	app.get('/quiz/answer/:id', function(req, res) {
		Quiz.findOne({'questions._id': req.params.id}, {'questions.$': 1}, function(err, data) {	
			if (err) {
				console.log(err);
			}

			res.json(data.questions[0].answer);
		});
	});


	port = Number(process.env.PORT || 5000);
	app.listen(port, function() {
		console.log("Listening on " + port);
	});

// ##### WEB APP SETUP ##### //
	//Fisher-Yates algorithm
    function shuffle (o) {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

})();