/*
{	title:'NHL Goalies',
	lastUpdated:'2014-03-11 17:55:00',
	questions: [
		{	'question': 'What does the fox say?',
			'answer': 'Meep meep!'}
	]
};
*/

fs = require('fs');
fs.readFile('/doesnt/exist', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});