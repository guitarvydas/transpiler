package user0d

import "core:fmt"

import reg "../registry0d"
import zd "../0d"
import leaf "../leaf0d"

start_logger :: proc () -> bool {
    return true
}

components :: proc (leaves: ^[dynamic]reg.Leaf_Initializer) {
    append(leaves, reg.Leaf_Instantiator { name = "1then2", init = leaf.deracer_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "?", init = leaf.probe_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "trash", init = leaf.trash_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "null tester", init = leaf.nulltester_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "stringconcat", init = leaf.stringconcat_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "panic", init = leaf.panic_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "command", init = leaf.command_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "icommand", init = leaf.icommand_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "Read Text File", init = leaf.read_text_file_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "Read Text From FD", init = leaf.read_text_from_fd_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "Open Text File", init = leaf.open_text_file_instantiate })

    append(leaves, reg.Leaf_Instantiator { name = "suffix", init = leaf.suffix_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "syncfilewrite", init = leaf.syncfilewrite_instantiate })

    // in the fullness of time, these can probably be deleted...
    append(leaves, reg.Leaf_Instantiator { name = "literalgrep", init = leaf.literalgrep_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "literalvsh", init = leaf.literalvsh_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "literalpsgrepwcl", init = leaf.literalpsgrepwcl_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "literalwcl", init = leaf.literalwcl_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "hard_coded_ps", init = leaf.hard_coded_ps_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "hard_coded_grepvsh", init = leaf.hard_coded_grepvsh_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "hard_coded_wcl", init = leaf.hard_coded_wcl_instantiate })

    // for ohmjs
    append(leaves, reg.Leaf_Instantiator { name = "HardCodedGrammar", init = leaf.hard_coded_rwr_grammar_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "HardCodedSemantics", init = leaf.hard_coded_rwr_semantics_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "HardCodedSupport", init = leaf.hard_coded_rwr_support_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "Bang", init = leaf.bang_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "concat", init = leaf.concat_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "ohmjs", init = leaf.ohmjs0_instantiate })

    // for prolog
    append(leaves, reg.Leaf_Instantiator { name = "'VirtualComma'", init = leaf.vc_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/virtualcomma.ohm'", init = leaf.vcohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/virtualcomma.js'", init = leaf.vcjs_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "OhmJS", init = leaf.ohmjs_instantiate })

    append(leaves, reg.Leaf_Instantiator { name = "'RWR'", init = leaf.rwr_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'rwr.ohm'", init = leaf.rwrohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'rwr.sem.js'", init = leaf.rwrsemjs_instantiate })

    append(leaves, reg.Leaf_Instantiator { name = "'Escapes'", init = leaf.escapes_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/escapes.ohm'", init = leaf.escapesohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/escapes.rwr'", init = leaf.escapesrwr_instantiate })
    
    append(leaves, reg.Leaf_Instantiator { name = "fakepipename", init = leaf.fakepipename_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "syncfilewrite2", init = leaf.syncfilewrite2_instantiate })
    
    append(leaves, reg.Leaf_Instantiator { name = "'Unquote'", init = leaf.unquote_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/unquote.ohm.m4'", init = leaf.unquoteohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/unquote.rwr.m4'", init = leaf.unquoterwr_instantiate })

    append(leaves, reg.Leaf_Instantiator { name = "'Constants'", init = leaf.constants_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/constants.ohm.m4'", init = leaf.constantsohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'prolog/constants.rwr.m4'", init = leaf.constantsrwr_instantiate })

    
    append(leaves, reg.Leaf_Instantiator { name = "'SymRewrites'", init = leaf.symrewrites_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/symrewrites.ohm.m4'", init = leaf.symrewritesohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/symrewrites.rwr.m4'", init = leaf.symrewritesrwr_instantiate })
    
    append(leaves, reg.Leaf_Instantiator { name = "'ListRewrites'", init = leaf.listrewrites_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/listrewrites.ohm.m4'", init = leaf.listrewritesohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/listrewrites.rwr.m4'", init = leaf.listrewritesrwr_instantiate })
    
    append(leaves, reg.Leaf_Instantiator { name = "'JSMacro'", init = leaf.macro_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/macro.ohm.m4'", init = leaf.macroohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/macro.rwr.m4'", init = leaf.macrorwr_instantiate })
    
    append(leaves, reg.Leaf_Instantiator { name = "'ExprStatements'", init = leaf.exprstatements_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/exprstatements.ohm.m4'", init = leaf.exprstatementsohm_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/exprstatements.rwr.m4'", init = leaf.exprstatementsrwr_instantiate })
    append(leaves, reg.Leaf_Instantiator { name = "'js/exprstatementssupport.js'", init = leaf.exprstatementssupport_instantiate })

    append(leaves, reg.Leaf_Instantiator { name = "': '", init = leaf.colonspc_instantiate })

}



