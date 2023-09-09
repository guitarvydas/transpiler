character rewrites:
-				_

atom rewrites:
#t				true
#f				false
pair?				isPair
r!				rBang
foreign?			isForeign
var?				isVar
null?				isEmptyList
e*				eStar

list rewrites:
(define (fn ...1) ...2)		function fn (...1) { ...2 }
(eqv? ...1 ...2)		(...1 === ...2)
(string=? ...1 ...2)		(...1 === ...2)
(eq? ...1 ...2)			(...1 == ...2)
(+ ...1 ...2)			(...1 + ...2)
(and ...1 ...2)			(...1 && ...2)
(fn ...)			fn (...)


ₓ
ٖᵢᵣᵤᵥᵦᵧᵨᵩᵪₔ




var testString = 'scm6a.scm'

var str = doPreReplacements(testString);
      function doPipeline(testElement) {
	  var testString = testElement.innerHTML;
	  var str = doPreReplacements(testString);

          var parsed_pass1 = pass1_grammar.match(str);
              var transpiled_pass1 = pass1_semantics(parsed_pass1).unbackquote();
	      
	      var parsed_listConstants = listConstants_grammar.match(transpiled_pass1);
		  var transpiled_listConstants = listConstants_semantics(parsed_listConstants).listConstants();

		  var str = doPreReplacements(transpiled_listConstants);
		  var parsed_emitter = emitter_grammar.match(str);
		      var transpiled_emitter = doPostReplacements(emitter_semantics(parsed_emitter).emitjs());
		      resultsString = resultsString + "<br>final:<br>" + transpiled_emitter;
		  }
	      }
	  }
      }

```
1. unbackquote <<< pass1_grammar
2. listConstants <<< listConstants_grammar
3. doPreReplacements
4. emitjs <<< emitter_grammar
5. doPostReplacements
```



var parsed_pass1 = pass1_grammar.match(str);
var transpiled_pass1 = pass1_semantics(parsed_pass1).unbackquote();
var parsed_listConstants = listConstants_grammar.match(transpiled_pass1);
var transpiled_listConstants = listConstants_semantics(parsed_listConstants).listConstants();
var str = doPreReplacements(transpiled_listConstants);
var parsed_emitter = emitter_grammar.match(str);
var transpiled_emitter = doPostReplacements(emitter_semantics(parsed_emitter).emitjs());


      function doPreReplacements(inputString) {
	  var r = inputString
	      .replace(/string[?]/g,"string_Q_")
	      .replace(/string=[?]/g,"string_EQ_Q_")

              .replace(/foreign[?]/g,"foreign_Q_")
              .replace(/call-foreign/g,"call_foreign")
              .replace(/resolved-args/g,"resolved_args")

	      .replace(/'!/g,'"!"')
	      .replace(/[(][+]/g,"(_plus ")
	      .replace(/null[?]/g,"null_Q_")
	      .replace(/pair[?]/g,"pair_Q_")
	      .replace(/e[*]/g,"e_A_")
	      .replace(/car[!]/g,"car_B_")
	      .replace(/var[?]/g,"var_Q_")
	      .replace(/eqv[?]/g,"eqv_Q_")
	      .replace(/eq[?]/g,"eq_Q_")
	      .replace(/set-car/g,"set_car")
	      .replace(/lookup-loop/g,"lookup_loop")
	      .replace(/whole-db/g,"whole_db")
	      .replace(/try/g,"_try")

	      .replace(/print-frame/g,"print_frame")

	  ;
	  return r;
      }

      function doPostReplacements(inputString) {
	  var r = inputString
	      .replace(/[(]r!,/g,'("r!",')
              .replace(/set!/g,"set_B_")
	  ;
	  return r;
      }
      
