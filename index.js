(function(){

// ##### CONFIGURATION ##### //

	var express 	= require("express"),
		logfmt 		= require("logfmt"),
		mongoose 	= require('mongoose'),
		db, schemaQuiz, schemaQuestion, Quiz, app, port;


// ##### DATABASE CONNECTION ##### //
	db = mongoose.connect('mongodb://mynhltest:mynhltest@novus.modulusmongo.net:27017/vi3Rizov');

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

	/*
	// create questions
	Quiz.create({ title: 'NHL - Goalies',
  updated: '2014-03-11 17:55:00',
  questions:
   [ { question: 'Who is the goalie for the Anaheim Ducks?',
       answer: 'Jonas Hiller' },
     { question: 'Who is the goalie for the Boston Bruins?',
       answer: 'Tuukka Rask' },
     { question: 'Who is the goalie for the Buffalo Sabres?',
       answer: 'Jhonas Enroth' },
     { question: 'Who is the goalie for the Calgary Flames?',
       answer: 'Joni Ortio' },
     { question: 'Who is the goalie for the Carolina Hurricanes?',
       answer: 'Anton Khudobin' },
     { question: 'Who is the goalie for the Chicago Blackhawks?',
       answer: 'Corey Crawford' },
     { question: 'Who is the goalie for the Colorado Avalanche?',
       answer: 'Semyon Varlamov' },
     { question: 'Who is the goalie for the Columbus Blue Jackets?',
       answer: 'Sergei Bobrovsky' },
     { question: 'Who is the goalie for the Dallas Stars?',
       answer: 'Tim Thomas' },
     { question: 'Who is the goalie for the Detroit Red Wings?',
       answer: 'Jimmy Howard' },
     { question: 'Who is the goalie for the Edmonton Oilers?',
       answer: 'Ben Scrivens' },
     { question: 'Who is the goalie for the Florida Panthers?',
       answer: 'Roberto Luongo' },
     { question: 'Who is the goalie for the Los Angeles Kings?',
       answer: 'Jonathan Quick' },
     { question: 'Who is the goalie for the Minnesota Wild?',
       answer: 'Darcy Kuemper' },
     { question: 'Who is the goalie for the Montreal Canadiens?',
       answer: 'Carey Price' },
     { question: 'Who is the goalie for the Nashville Predators?',
       answer: 'Pekka Rinne' },
     { question: 'Who is the goalie for the New Jersey Devils?',
       answer: 'Martin Brodeur' },
     { question: 'Who is the goalie for the New York Islanders?',
       answer: 'Evgeni Nabokov' },
     { question: 'Who is the goalie for the New York Rangers?',
       answer: 'Henrik Lundqvist' },
     { question: 'Who is the goalie for the Philadelphia Flyers?',
       answer: 'Steve Mason' },
     { question: 'Who is the goalie for the Phoenix Coyotes?',
       answer: 'Mike Smith' },
     { question: 'Who is the goalie for the Pittsburgh Penguins?',
       answer: 'Marc-André Fleury' },
     { question: 'Who is the goalie for the Ottawa Senators?',
       answer: 'Craig Anderson' },
     { question: 'Who is the goalie for the San Jose Sharks?',
       answer: 'Antti Niemi' },
     { question: 'Who is the goalie for the St Louis Blues?',
       answer: 'Ryan Miller' },
     { question: 'Who is the goalie for the Tampa Bay Lightning?',
       answer: 'Ben Bishop' },
     { question: 'Who is the goalie for the Toronto Maple Leafs?',
       answer: 'Jonathan Bernier' },
     { question: 'Who is the goalie for the Vancouver Canucks?',
       answer: 'Eddie Läck' },
     { question: 'Who is the goalie for the Washington Capitals?',
       answer: 'Jaroslav Halak' },
     { question: 'Who is the goalie for the Winnipeg Jets?',
       answer: 'Ondrej Pavelec' } ] });
	
	

	
	Quiz.create({ title: 'NHL - Head coaches',
  updated: '2014-03-22 19:30:00',
  questions:
   [ { question: 'Who is the head coach for the Anaheim Ducks?',
       answer: 'Bruce Boudreau' },
     { question: 'Who is the head coach for the Boston Bruins?',
       answer: 'Claude Julien' },
     { question: 'Who is the head coach for the Buffalo Sabres?',
       answer: 'Ted Nolan' },
     { question: 'Who is the head coach for the Calgary Flames?',
       answer: 'Bob Hartley' },
     { question: 'Who is the head coach for the Carolina Hurricanes?',
       answer: 'Kirk Muller' },
     { question: 'Who is the head coach for the Chicago Blackhawks?',
       answer: 'Joel Quenneville' },
     { question: 'Who is the head coach for the Colorado Avalanche?',
       answer: 'Patrick Roy' },
     { question: 'Who is the head coach for the Columbus Blue Jackets?',
       answer: 'Todd Richards' },
     { question: 'Who is the head coach for the Dallas Stars?',
       answer: 'Lindy Ruff' },
     { question: 'Who is the head coach for the Detroit Red Wings?',
       answer: 'Mike Babcock' },
     { question: 'Who is the head coach for the Edmonton Oilers?',
       answer: 'Dallas Eakins' },
     { question: 'Who is the head coach for the Florida Panthers?',
       answer: 'Peter Horachek' },
     { question: 'Who is the head coach for the Los Angeles Kings?',
       answer: 'Darryl Sutter' },
     { question: 'Who is the head coach for the Minnesota Wild?',
       answer: 'Mike Yeo' },
     { question: 'Who is the head coach for the Montreal Canadiens?',
       answer: 'Michel Therrien' },
     { question: 'Who is the head coach for the Nashville Predators?',
       answer: 'Barry Trotz' },
     { question: 'Who is the head coach for the New Jersey Devils?',
       answer: 'Peter DeBoer' },
     { question: 'Who is the head coach for the New York Islanders?',
       answer: 'Jack Capuano' },
     { question: 'Who is the head coach for the New York Rangers?',
       answer: 'Alain Vigneault' },
     { question: 'Who is the head coach for the Philadelphia Flyers?',
       answer: 'Paul MacLean' },
     { question: 'Who is the head coach for the Phoenix Coyotes?',
       answer: 'Craig Berube' },
     { question: 'Who is the head coach for the Pittsburgh Penguins?',
       answer: 'Dave Tippett' },
     { question: 'Who is the head coach for the Ottawa Senators?',
       answer: 'Dan Bylsma' },
     { question: 'Who is the head coach for the San Jose Sharks?',
       answer: 'Todd McLellan' },
     { question: 'Who is the head coach for the St Louis Blues?',
       answer: 'Ken Hitchcock' },
     { question: 'Who is the head coach for the Tampa Bay Lightning?',
       answer: 'Jon Cooper' },
     { question: 'Who is the head coach for the Toronto Maple Leafs?',
       answer: 'Randy Carlyle' },
     { question: 'Who is the head coach for the Vancouver Canucks?',
       answer: 'John Tortorella' },
     { question: 'Who is the head coach for the Washington Capitals?',
       answer: 'Adam Oates' },
     { question: 'Who is the head coach for the Winnipeg Jets?',
       answer: 'Paul Maurice' } ] });
	*/

	/*
	// delete collection
	Quiz.remove({}, function(err) { 
	   console.log('collection removed') 
	});
	*/
	

	Quiz.find(function(err, questions) {	
		if (err) {
			console.log(err);
		}

		// return all questions in JSON format
		//console.log(questions);
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
			   	if (i==0) {console.log(answersCopy);}

			   	//3.shuffle array
			   	answersCopy = shuffle(answersCopy);

			   	//4.create new array with self and 3 first elements
			   	options = [data.questions[i].answer, answersCopy[0], answersCopy[1], answersCopy[2]];

			   	//5.shuffle new array
			   	options = shuffle(options);

			   	//6.append to some kind of json....
			   	json.questions[i].options = options;

			}
						   			
			// return all questions in JSON format
			res.json(json);
		});		
	});

	app.get('/quiz/question/:id', function(req, res) {
		Quiz.findOne({'questions._id': req.params.id}, {'questions.$': 1}, function(err, data) {	
			if (err) {
				console.log(err);
			}

			// return all questions in JSON format
			res.json(data.questions[0].question);
		});
	});

	app.get('/quiz/answer/:id', function(req, res) {
		Quiz.findOne({'questions._id': req.params.id}, {'questions.$': 1}, function(err, data) {	
			if (err) {
				console.log(err);
			}

			// return all questions in JSON format
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