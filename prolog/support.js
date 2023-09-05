	  var str = doPreReplacements(testString);
          var parsed_pass1 = pass1_grammar.match(str);
pass1_semantics
listConstants_grammar.match(transpiled_pass1)
listConstants_semantics(parsed_listConstants).listConstants();
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
      
