(defineₓ(foreign?ₓexprₓ)(andₓ(pair?ₓexprₓ)(string?ₓ(carₓexprₓ))(string=?ₓ"@ₓ"(carₓexprₓ))))(defineₓ(call_foreignₓexprₓbindingsₓ)(letₓ((funcₓ(cadrₓexprₓ))(argsₓ(cddrₓexprₓ)))(condₓ((string=?ₓ"unityₓ"funcₓ)(carₓargsₓ))((string=?ₓ"addₓ"funcₓ)(letₓ((resolved_argsₓ(resolveArgsₓargsₓbindingsₓ)))(+ₓ(carₓresolved_argsₓ)(cadrₓresolved_argsₓ))))((string=?ₓ"displayₓ"funcₓ)(letₓ((aₓ(valueₓ(carₓargsₓ)bindingsₓ)))(displayₓaₓ)))((string=?ₓ"newlineₓ"funcₓ)(newlineₓ))(elseₓ(errorₓ"call_foreignₓ&nbsp;calledₓ&nbsp;withₓ&nbsp;unknownₓ&nbsp;operatorₓ"funcₓ)))))(clear_resultₓ)(newlineₓ)(newlineₓ)(prove6ₓ(constant_nilₓ)goalsₓdbₓemptyₓ1ₓ(constant_nilₓ)dbₓ)(display_resultₓ)(newlineₓ)(newlineₓ)

