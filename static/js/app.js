(function() {
	"use strict";

	var QuizApp = {
	
		questions: {},
		index: 0,
		points: 0,
		select: undefined,

		init: function() {
			QuizApp.handleInteractions();
			QuizApp.addHandlebarsHelpers();
			QuizApp.loadQuizes();				
		},

		resetValues: function () {
			QuizApp.questions = {},
			QuizApp.index = 0,
			QuizApp.points = 0
		},

		restart: function () {
			var questionSlides = document.querySelectorAll('.js-card-question-wrapper'),
				lastWrapper = document.getElementById('last-wrapper');

			QuizApp.resetValues();
			QuizApp.removeNodes(questionSlides);
			QuizApp.slideWithDelay.call(lastWrapper, 0, true);
		},

		removeNodes: function (nodes) {
			[].forEach.call(nodes, function(node) {
			    node.parentNode.removeChild(node);
			});	
		},

		loadQuizes: function () {			
			QuizApp.promiseGet('/quiz', 'json')
			.then(function(response) {
				var selectEl = document.getElementById('select-quiz'), 
					quizes, option, i;

					try {
					   quizes = JSON.parse(response);
					} catch(e) {
					   quizes = response;
					}

				for (i = 0; i < quizes.length; i++) {
					option = new Option(quizes[i].title, quizes[i]._id);
					selectEl.appendChild(option);
				}								

				// select should not be created here, but in init. Need to solve that.
				QuizApp.select = new Select({el: document.getElementById('select-quiz'), className: 'select-theme-dark'});	
			}).done();	
		},

		loadQuestions: function (quizID) {
			Q.all([QuizApp.promiseGet('/quiz/'+quizID, 'json'), QuizApp.promiseGet('/static/templates.html', 'document')])
			.then(function(response) {
				var firstWrapper = document.getElementById('first-wrapper'),
					lastWrapper = document.getElementById('last-wrapper'),
					questionsObj, cards, questionElements, source, template, html, wrapper, children, i;
				
				try {
				   questionsObj = JSON.parse(response[0]);
				} catch(e) {
				   questionsObj = response[0];
				}

				
				QuizApp.questions = questionsObj.questions;

				// run data through template and populate DOM
				source = response[1].getElementById('questionsTemplate').innerHTML;					
		    	template = Handlebars.compile(source);			    	
		    	html = template({'questions' : QuizApp.questions});			    	

		    	// ugly solution (avoid innerHTML), use https://www.npmjs.org/package/dombars			    	
				wrapper = document.createElement('div');
				wrapper.innerHTML = html;
				children = wrapper.children;

				while (children.length) {						
					lastWrapper.parentNode.insertBefore(children[0], lastWrapper);					
				}					
				
				// set max score
				document.getElementById('max-score').textContent = QuizApp.questions.length;

				// start
				QuizApp.slideWithDelay.call(firstWrapper, 0);

			}, function() {
				// one or more failed
			})
			.done();	
		},

		handleInteractions: function () {
			document.getElementById('quijs-app').addEventListener('click', function(e) {	
				var card;

				e.preventDefault();	

				if (e.target === document.getElementById('button-start')) {				
					QuizApp.loadQuestions(QuizApp.select.value);
				}

				if (e.target === document.getElementById('button-back')) {					
					QuizApp.restart();
				}
				
				if (QuizApp.hasClass.call(e.target, 'js-card-option')) {
					card = QuizApp.getParent.call(e.target, 'card');

					QuizApp.deactivateOptions(card);					
					QuizApp.checkAnswer(e.target);
				}						
			});
		},

		deactivateOptions: function (card) {
			var options = card.querySelectorAll('.js-card-option');

			[].forEach.call(options, function(node) {
			    node.classList.remove('js-card-option');
			});
		},

		checkAnswer: function (option) {
			var userAnswer = option.textContent,
				parent = option.parentNode,
				hasParent, parent, correctAnswer, cardBackClass;		
										
			QuizApp.promiseGet('/quiz/answer/'+QuizApp.questions[QuizApp.index-1]._id, 'json')
			.then(function(response) {

				try {
				   correctAnswer = JSON.parse(response);
				} catch(e) {
				   correctAnswer = response;
				}										

				if (userAnswer === correctAnswer) {					
					cardBackClass = 'back-correct';
					QuizApp.increaseScore();							
				} else {
					cardBackClass = 'back-wrong';					
				}					

				parent = QuizApp.getParent.call(option, 'card');

				parent.querySelector('.js-card-back').classList.add(cardBackClass);
				parent.classList.add('answer-displayed');	
				QuizApp.slideWithDelay.call(parent.parentNode, 600);				
			})
			.done();			
		},

		getParent: function (parentClass) {
			var parent = this.parentNode; 

			if (parentClass !== 'undefined') {
				while (!QuizApp.hasClass.call(parent, parentClass) && parent !== null) {
					parent = parent.parentNode;						
				}	
			}

			return parent;
		},
		
		hasClass: function (selector) {				
		    var className = ' ' + selector + ' ';
	        if ((' ' + this.className + ' ').replace(/[\n\t\r]/g, ' ').indexOf(className) > -1) {
	            return true;
	        }			   

		    return false;
		},

		slideWithDelay: function (delay, slideReversed) {
			var node = this,
				ms = (delay === 'undefined') ? 0 : delay,
				shouldGoForward = (slideReversed === 'undefined' || !slideReversed),
				nextWrapper;

			if (shouldGoForward) {
				nextWrapper = node.nextSibling;

				while (nextWrapper.nodeType !== 1) {
					nextWrapper = nextWrapper.nextSibling;					
				}

				QuizApp.index++;
			} else {
				nextWrapper = node.previousSibling;

				while (nextWrapper.nodeType !== 1) {
					nextWrapper = nextWrapper.previousSibling;										
				}

				if (QuizApp.index > 0) {
					QuizApp.index--;	
				}
			}

			setTimeout(function () {
				if (shouldGoForward) {
					node.classList.add('card-wrapper-used');
					node.classList.remove('card-wrapper-current');				
					nextWrapper.classList.add('card-wrapper-current');
				} else {
					node.classList.remove('card-wrapper-current');				
					nextWrapper.classList.add('card-wrapper-current');
					nextWrapper.classList.remove('card-wrapper-used');	
				}
			}, ms);	
		},

		increaseScore: function () {				
			document.getElementById('points').textContent = ++QuizApp.points;
		},

		promiseGet: function (url, responseType) {
			var d = Q.defer();
			Q.stopUnhandledRejectionTracking();

			// Do the usual XHR stuff
			var req = new XMLHttpRequest();

			if (responseType !== 'undefined') {	
				try {
			        // some browsers throw when setting `responseType` to an unsupported value
			        req.responseType = responseType;
			    } catch(error) {
			        //d.reject(Error('Unsupported response type: ' + responseType));
			    }
			}
			
			req.open('GET', url);

			req.onload = function() {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					d.resolve(req.response);
				}
				else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					d.reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function () {
				d.reject(Error('Network Error'));
			};

			// Make the request
			req.send();

			return d.promise;
		},			

		// should move this to separate file
		addHandlebarsHelpers: function () {
			Handlebars.registerHelper('indexStartingAtOne', function(index) {
				return (parseInt(index) + 1) || '';
			});

			Handlebars.registerHelper('length', function(arr) {
				if (Array.isArray(arr)) {
					return arr.length;
				}

				return '';
			}); 

			Handlebars.registerHelper('randomNumberInInterval', function(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			});   

			Handlebars.registerHelper('randomCircularDirection', function() {
				var trueOrFalse = Math.floor(Math.random() * 2);

				return (trueOrFalse) ? 'cw' : 'ccw';
			});   

			/* Takes an index and converts to alpha (A-Z), when reaching Z it starts over */
			Handlebars.registerHelper('convertNumberToAlpha', function(index) {
				return String.fromCharCode(index%26 + 65);
			});
		}
	};

	QuizApp.init();	
})();