package leaf0d

import "core:fmt"
import "core:log"
import "core:strings"
import "core:slice"
import "core:os"
import "core:unicode/utf8"

import reg "../registry0d"
import "../process"
import "../syntax"
import zd "../0d"

stdout_instantiate :: proc(name: string) -> ^zd.Eh {
    return zd.make_leaf(name, stdout_proc)
}

stdout_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fmt.printf("%#v", msg.datum)
}

process_instantiate :: proc(name: string) -> ^zd.Eh {
    command_string := strings.clone(strings.trim_left(name, "$ "))
    command_string_ptr := new_clone(command_string)
    return zd.make_leaf(name, command_string_ptr, process_proc)
}

process_proc :: proc(eh: ^zd.Eh, msg: zd.Message, command: ^string) {

    utf8_string :: proc(bytes: []byte) -> (s: string, ok: bool) {
        s = string(bytes)
        ok = utf8.valid_string(s)
        return
    }
    
    send_output :: proc(eh: ^zd.Eh, port: string, output: []byte) {
        if len(output) > 0 {
            str, ok := utf8_string(output)
            if ok {
                zd.send(eh, port, str)
            } else {
                zd.send(eh, port, output)
            }
        }
    }

    switch msg.port {
    case "stdin":
        handle := process.process_start(command^)
        defer process.process_destroy_handle(handle)

        // write input, wait for finish
        {
            switch value in msg.datum {
            case string:
                bytes := transmute([]byte)value
                os.write(handle.input, bytes)
            case []byte:
                os.write(handle.input, value)
            case zd.Bang:
                // OK, no input, just run it
            case:
                log.errorf("%s: Shell leaf input can handle string, bytes, or bang (got: %v)", eh.name, value.id)
            }
            os.close(handle.input)
            process.process_wait(handle)
        }

        // breaks bootstrap error check, thus, removed line: zd.send(eh, "done", Bang{})

        // stdout handling
        {
            stdout, ok := process.process_read_handle(handle.output)
            if ok {
                send_output(eh, "stdout", stdout)
            }
        }

        // stderr handling
        {
            stderr, ok := process.process_read_handle(handle.error)
            if ok {
                send_output(eh, "stderr", stderr)
            }

            if len(stderr) > 0 {
                str := string(stderr)
                str = strings.trim_right_space(str)
                log.error(str)
            }
        }
    }
}

collect_process_leaves :: proc(path: string, leaves: ^[dynamic]reg.Leaf_Instantiator) {
    ref_is_container :: proc(decls: []syntax.Container_Decl, name: string) -> bool {
        for d in decls {
            if d.name == name {
                return true
            }
        }
        return false
    }

    decls, err := syntax.parse_drawio_mxgraph(path)
    assert(err == nil)
    defer delete(decls)

    // TODO(z64): while harmless, this doesn't ignore duplicate process decls yet.

    for decl in decls {
        for child in decl.children {
            if ref_is_container(decls[:], child.name) {
                continue
            }

            if strings.has_prefix(child.name, "$") {
                leaf_instantiate := reg.Leaf_Instantiator {
                    name = child.name,
                    init = process_instantiate,
                }
                append(leaves, leaf_instantiate)
            }
        }
    }
}


hard_coded_ps_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("ps (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_ps_proc)
}

hard_coded_ps_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    captured_output, _ := process.run_command ("ps", nil)
    zd.send(eh, "stdout", captured_output)
}

hard_coded_grepvsh_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("grepvsh (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_grepvsh_proc)
}

hard_coded_grepvsh_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    received_input := msg.datum.(string)
    captured_output, _ := process.run_command ("grep vsh", received_input)
    zd.send(eh, "stdout", captured_output)
}

hard_coded_wcl_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("wcl (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_wcl_proc)
}

hard_coded_wcl_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    received_input := msg.datum.(string)
    captured_output, _ := process.run_command ("wc -l", received_input)
    zd.send(eh, "stdout", captured_output)
}

////

Command_Instance_Data :: struct {
    buffer : string
}

command_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("command (ID:%d)", counter)
    inst := new (Command_Instance_Data)
    return zd.make_leaf_with_data (name_with_id, inst, command_proc)
}

command_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Command_Instance_Data) {
    switch msg.port {
    case "command":
        inst.buffer = msg.datum.(string)
        received_input := msg.datum.(string)
        captured_output, _ := process.run_command (inst.buffer, received_input)
        zd.send(eh, "stdout", captured_output)
    case:
        fmt.assertf (false, "!!! ERROR: command got an illegal message port %v", msg.port)
    }
}

icommand_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("icommand (ID:%d)", counter)
    inst := new (Command_Instance_Data)
    return zd.make_leaf_with_data (name_with_id, inst, icommand_proc)
}

icommand_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Command_Instance_Data) {
    switch msg.port {
    case "command":
        inst.buffer = msg.datum.(string)
    case "stdin":
        received_input := msg.datum.(string)
        captured_output, _ := process.run_command (inst.buffer, received_input)
        zd.send(eh, "stdout", captured_output)
    case:
        fmt.assertf (false, "!!! ERROR: command got an illegal message port %v", msg.port)
    }
}

literalwcl_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("literalwcl (ID:%d)", counter)
    return zd.make_leaf(name_with_id, literalwcl_proc)
}

literalwcl_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "literal", "wc -l")
}


literalgrepvsh_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("literalgrepvsh (ID:%d)", counter)
    return zd.make_leaf(name_with_id, literalgrepvsh_proc)
}

literalgrepvsh_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "literal", "grep vsh")
}

literalpsgrepwcl_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("literalpsgrepwcl (ID:%d)", counter)
    return zd.make_leaf(name_with_id, literalpsgrepwcl_proc)
}

literalpsgrepwcl_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "literal", "ps | grep vsh | wc -l")
}





////

TwoAnys :: struct {
    first : zd.Message,
    second : zd.Message
}


Deracer_States :: enum { idle, waitingForFirst, waitingForSecond }

Deracer_Instance_Data :: struct {
    state : Deracer_States,
    buffer : TwoAnys
}

reclaim_Buffers_from_heap :: proc (inst : ^Deracer_Instance_Data) {
    zd.destroy_message (inst.buffer.first)
    zd.destroy_message (inst.buffer.second)
}

deracer_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("deracer (ID:%d)", counter)
    inst := new (Deracer_Instance_Data) // allocate in the heap
    eh := zd.make_leaf_with_data (name_with_id, inst, deracer_proc)
    inst.state = .idle
    return eh
}

send_first_then_second :: proc (eh : ^zd.Eh, inst: ^Deracer_Instance_Data) {
    zd.send(eh, "1", inst.buffer.first.datum)
    zd.send(eh, "2", inst.buffer.second.datum)
    reclaim_Buffers_from_heap (inst)
}

deracer_proc :: proc(eh: ^zd.Eh,  msg: zd.Message, inst: ^Deracer_Instance_Data) {
    switch (inst.state) {
    case .idle:
        switch msg.port {
        case "1":
            inst.buffer.first = msg
            inst.state = .waitingForSecond
        case "2":
            inst.buffer.second = msg
            inst.state = .waitingForFirst
        case:
            fmt.assertf (false, "bad msg.port A for deracer %v\n", msg.port)
        }
    case .waitingForFirst:
        switch msg.port {
        case "1":
            inst.buffer.first = msg
            send_first_then_second (eh, inst)
            inst.state = .idle
        case:
            fmt.assertf (false, "bad msg.port B for deracer %v\n", msg.port)
        }
    case .waitingForSecond:
        switch msg.port {
        case "2":
            inst.buffer.second = msg
            send_first_then_second (eh, inst)
            inst.state = .idle
        case:
            fmt.assertf (false, "bad msg.port C for deracer %v\n", msg.port)
        }
    case:
        fmt.assertf (false, "bad state for deracer %v\n", eh.state)
    }
}

/////////

probe_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("?%d", counter)
    return zd.make_leaf(name_with_id, probe_proc)
}

probe_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fmt.eprintln (eh.name, msg.datum)
}

trash_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("trash%d", counter)
    return zd.make_leaf(name_with_id, trash_proc)
}

trash_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    // to appease dumped-on-floor checker
}

nulltester_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("nulltester (ID:%d)", counter)
    return zd.make_leaf(name_with_id, nulltester_proc)
}

nulltester_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    if "" == msg.datum.(string) {
	zd.send(eh, "null", "")
    } else {
	zd.send(eh, "str", msg.datum.(string))
    }
}

literalvsh_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("literalvsh (ID:%d)", counter)
    return zd.make_leaf(name_with_id, literalvsh_proc)
}

literalvsh_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "literal", "vsh")
}

literalgrep_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("literalgrep (ID:%d)", counter)
    return zd.make_leaf(name_with_id, literalgrep_proc)
}

literalgrep_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "literal", "grep ")
}

///

StringConcat_Instance_Data :: struct {
    buffer : string
}

stringconcat_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("stringconcat (ID:%d)", counter)
    inst := new (StringConcat_Instance_Data)
    return zd.make_leaf(name_with_id, inst, stringconcat_proc)
}

stringconcat_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^StringConcat_Instance_Data) {
    switch msg.port {
    case "1":
	inst.buffer = strings.clone (msg.datum.(string))
    case "2":
	s := strings.clone (msg.datum.(string))
	if 0 == len (inst.buffer) || 0 == len (s) {
	    fmt.printf ("stringconcat %d %d\n", len (inst.buffer), len (s))
	    fmt.assertf (false, "TODO: something is wrong, 0 length string passed to stringconcat\n")
	}
	concatenated_string := fmt.aprintf ("%s%s", inst.buffer, s)
	zd.send(eh, "str", concatenated_string)
    case:
        fmt.assertf (false, "bad msg.port for stringconcat: %v\n", msg.port)
    }
}

////////

read_text_file_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("Read Text File (ID:%d)", counter)
    return zd.make_leaf(name_with_id, read_text_file_proc)
}

read_text_file_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fd, errnum := os.open (msg.datum.(string))
    if errnum == 0 {
	data, success := os.read_entire_file_from_handle (fd)
	if success {
	    zd.send(eh, "str", transmute(string)data)
	} else {
            emsg := fmt.aprintf("read error on file %s", msg.datum.(string))
	    zd.send(eh, "error", emsg)
	}
    } else {
        emsg := fmt.aprintf("open error on file %s with error code %v", msg.datum.(string), errnum)
	zd.send(eh, "error", emsg)
    }
}

////////

panic_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("panic (ID:%d)", counter)
    return zd.make_leaf(name_with_id, panic_proc)
}

panic_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fmt.println ("PANIC: ", msg.datum.(string))
    // assert (false, msg.datum.(string))
}

////

open_text_file_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("Open Text File (ID:%d)", counter)
    return zd.make_leaf(name_with_id, open_text_file_proc)
}

open_text_file_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fd, errnum := os.open (msg.datum.(string))
    if errnum == 0 {
	zd.send(eh, "fd", fd)
    } else {
        emsg := fmt.aprintf("open error on file %s with error code %v", msg.datum.(string), errnum)
	zd.send(eh, "error", emsg)
    }
}

////////

read_text_from_fd_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("Read Text From FD (ID:%d)", counter)
    return zd.make_leaf(name_with_id, read_text_from_fd_proc)
}

read_text_from_fd_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    fd := msg.datum.(os.Handle)
    data, success := os.read_entire_file_from_handle (fd)
    if success {
	zd.send(eh, "str", transmute(string)data)
    } else {
        emsg := fmt.aprintf("read error on file %s", msg.datum.(string))
	zd.send(eh, "error", emsg)
    }
}

//////////

Transpile_Instance_Data :: struct {
    grammar_name : string,
    fab_name : string,
    support_name : string
}

transpiler_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("Transpiler (ID:%d)", counter)
    inst := new (Transpile_Instance_Data)
    return zd.make_leaf_with_data (name_with_id, inst, transpiler_leaf_proc)
}

transpiler_leaf_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Transpile_Instance_Data) {
    switch msg.port {
    case "grammar":
        inst.grammar_name = msg.datum.(string)
    case "fab":
        inst.fab_name = msg.datum.(string)
    case "support":
        inst.support_name = msg.datum.(string)
    case "stdin":
        received_input := msg.datum.(string)
        cmd := fmt.aprintf ("./transpile %s %s %s", inst.grammar_name, inst.fab_name, inst.support_name)
	captured_output, captured_stderr := process.run_command (cmd, received_input)
	if string (captured_stderr) != "" {
            zd.send(eh, "error", captured_stderr)
	} else {
            zd.send(eh, "output", captured_output)
	}
     case:
        emsg := fmt.aprintf("!!! ERROR: transpile got an illegal message port %v", msg.port)
	zd.send(eh, "error", emsg)
    }
}

////////

Syncfilewrite_Data :: struct {
    filename : string
}

syncfilewrite_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("syncfilewrite (ID:%d)", counter)
    inst := new (Syncfilewrite_Data)
    return zd.make_leaf(name_with_id, inst, syncfilewrite_proc)
}

syncfilewrite_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Syncfilewrite_Data) {
    switch msg.port {
    case "filename":
	inst.filename = msg.datum.(string)
    case "stdin":
	contents := msg.datum.(string)
	ok := os.write_entire_file (inst.filename, transmute([]u8)contents, true)
	if !ok {
	    zd.send (eh, "stderr", "write error")
	}
    }
}

////////

Suffix_Data :: struct {
    suffix : string
}

suffix_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1
    name_with_id := fmt.aprintf("suffix (ID:%d)", counter)
    inst := new (Suffix_Data)
    inst.suffix = ""
    return zd.make_leaf(name_with_id, inst, suffix_proc)
}

suffix_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Suffix_Data) {
    switch msg.port {
    case "suffix":
	inst.suffix = msg.datum.(string)
    case "str":
	s := fmt.aprintf ("%v%v", msg.datum.(string), inst.suffix)
	zd.send (eh, "str", s)
    case:
	zd.send (eh, "error", fmt.aprintf ("illegal port for suffix: ~v", msg.port))
    }
}



/////

/*

rwr_grammar := "
RWR {
top = spaces name spaces \"{\" spaces rule+ spaces \"}\" spaces more*
more = name spaces \"{\" spaces rule* spaces \"}\" spaces
rule = applySyntactic<RuleLHS> spaces \"=\" spaces rewriteString -- up
RuleLHS = 
  | name \"[\" Param* \"]\" spaces downString spaces -- down
  | name \"[\" Param* \"]\" -- nodown
rewriteString = \"‛\" char* \"’\" spaces
downString = \"‛\" char* \"’\"
char =
  | \"«\" nonBracketChar* \"»\" -- eval
  | \"\\\" \"n\" -- newline
  | \"\\\" any -- esc
  | ~\"’\" ~\"]]\" any     -- raw
nonBracketChar = ~\"»\" ~\"«\"  ~\"’\" ~\"]]\" any
name = nameFirst nameRest*
nameFirst = \"_\" | letter
nameRest = \"_\" | alnum
Param =
  | name \"+\" -- plus
  | name \"*\" -- star
  | name \"?\" -- opt
  | name     -- flat
comment = \"//\" (~\"\n\" any)* \"\n\"
space += comment
}
"

*/

/*

rwr_semobject := "

    top : function (_ws1,_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3,_more) { 
        _ruleEnter (\"top\");

        var ws1 = _ws1._rwr ();
        var name = _name._rwr ();
        var ws2 = _ws2._rwr ();
        var lb = _lb._rwr ();
        var ws4 = _ws4._rwr ();
        var rule = _rule._rwr ().join (\'\');
        var ws5 = _ws5._rwr ();
        var rb = _rb._rwr ();
        var ws3 = _ws3._rwr ();
        var more = _more._rwr ().join (\'\');
        var _result = `{
${rule}${more}
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`; 
        _ruleExit (\"top\");
        return _result; 
    },

    more : function (_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3) { 
        _ruleEnter (\"top\");

        var name = _name._rwr ();
        var ws2 = _ws2._rwr ();
        var lb = _lb._rwr ();
        var ws4 = _ws4._rwr ();
        var rule = _rule._rwr ().join (\'\');
        var ws5 = _ws5._rwr ();
        var rb = _rb._rwr ();
        var ws3 = _ws3._rwr ();
        var _result = `
${rule}
`; 
        _ruleExit (\"top\");
        return _result; 
    },


    ////
    


    rule_up : function (_lhs,_ws1,_keq,_ws2,_rws) { 
        _ruleEnter (\"rule_up\");

        var lhs = _lhs._rwr ();
        var ws1 = _ws1._rwr ();
        var keq = _keq._rwr ();
        var ws2 = _ws2._rwr ();
        var rws = _rws._rwr ();
        var _result = `${lhs}
_ruleExit (\"${getRuleName ()}\");
return ${rws}
},
`; 
        _ruleExit (\"rule_up\");
        return _result; 
    },
    ////
    
    // RuleLHS [name lb @Params rb] = [[${name}: function (${extractFormals(Params)}) {\\n_ruleEnter (\"${name}\");${setRuleName (name)}${Params}
    // ]]
    RuleLHS_nodown : function (_name,_lb,_Params,_rb) { 
        _ruleEnter (\"RuleLHS_nodown\");

        var name = _name._rwr ();
        var lb = _lb._rwr ();
        var Params = _Params._rwr ().join (\'\');
        var rb = _rb._rwr ();
        var _result = `${name}: function (${extractFormals(Params)}) {\\n_ruleEnter (\"${name}\");${setRuleName (name)}${Params}
`; 
        _ruleExit (\"RuleLHS_nodown\");
        return _result; 
    },
    
    RuleLHS_down : function (_name,_lb,_Params,_rb, _ws1, _downstring, _ws2) { 
        _ruleEnter (\"RuleLHS_down\");

        var name = _name._rwr ();
        var lb = _lb._rwr ();
        var Params = _Params._rwr ().join (\'\');
        var rb = _rb._rwr ();
        var _result = `${name}: function (${extractFormals(Params)}) {\\n_ruleEnter (\"${name}\");${setRuleName (name)}\\nvar _0 = ${_downstring._rwr ()};\\n${Params}
`; 
        _ruleExit (\"RuleLHS_down\");
        return _result; 
    },

    ////


    // rewriteString [sb @cs se ws] = [[return \\`${cs}\\`;]]
    rewriteString : function (_sb,_cs,_se,_ws) { 
        _ruleEnter (\"rewriteString\");

        var sb = _sb._rwr ();
        var cs = _cs._rwr ().join (\'\');
        var se = _se._rwr ();
        var ws = _ws._rwr ();
        var _result = `\\`${cs}\\`;`; 
        _ruleExit (\"rewriteString\");
        return _result; 
    },

    downString : function (_sb,_cs,_se) { 
        _ruleEnter (\"downString\");

        var sb = _sb._rwr ();
        var cs = _cs._rwr ().join (\'\');
        var se = _se._rwr ();
        var _result = `\\`${cs}\\``; 
        _ruleExit (\"downString\");
        return _result; 
    },


    ////
    // char_eval [lb name rb] = [[\\$\\{${name}\\}]]
    // char_raw [c] = [[${c}]]
    char_eval : function (_lb,_cs,_rb) { 
        _ruleEnter (\"char_eval\");

        var lb = _lb._rwr ();
        var name = _cs._rwr ().join (\'\');
        var rb = _rb._rwr ();
        var _result = `\\$\\{${name}\\}`; 
        _ruleExit (\"char_eval\");
        return _result; 
    },
    
    char_newline : function (_slash, _c) { 
        _ruleEnter (\"char_newline\");

        var slash = _slash._rwr ();
        var c = _c._rwr ();
        var _result = `\\n`; 
        _ruleExit (\"char_newline\");
        return _result; 
    },
    char_esc : function (_slash, _c) { 
        _ruleEnter (\"char_esc\");

        var slash = _slash._rwr ();
        var c = _c._rwr ();
        var _result = `${c}`; 
        _ruleExit (\"char_esc\");
        return _result; 
    },
    char_raw : function (_c) { 
        _ruleEnter (\"char_raw\");

        var c = _c._rwr ();
        var _result = `${c}`; 
        _ruleExit (\"char_raw\");
        return _result; 
    },
    ////
    
    // name [c @cs] = [[${c}${cs}]]
    // nameRest [c] = [[${c}]]

    name : function (_c,_cs) { 
        _ruleEnter (\"name\");

        var c = _c._rwr ();
        var cs = _cs._rwr ().join (\'\');
        var _result = `${c}${cs}`; 
        _ruleExit (\"name\");
        return _result; 
    },
    
    nameFirst : function (_c) { 
        _ruleEnter (\"nameFirst\");

        var c = _c._rwr ();
        var _result = `${c}`; 
        _ruleExit (\"nameFirst\");
        return _result; 
    },

    nameRest : function (_c) { 
        _ruleEnter (\"nameRest\");

        var c = _c._rwr ();
        var _result = `${c}`; 
        _ruleExit (\"nameRest\");
        return _result; 
    },

    ////


    // Param_plus [name k] = [[\\nvar ${name} = _${name}._rwr ().join (\'\');]]
    // Param_star [name k] = [[\\nvar ${name} = _${name}._rwr ().join (\'\');]]
    // Param_opt [name k] = [[\\nvar ${name} = _${name}._rwr ().join (\'\');]]
    // Param_flat [name] = [[\\nvar ${name} = _${name}._rwr ();]]


    Param_plus : function (_name,_k) { 
        _ruleEnter (\"Param_plus\");

        var name = _name._rwr ();
        var k = _k._rwr ();
        var _result = `\\n${name} = ${name}._rwr ().join (\'\');`; 
        _ruleExit (\"Param_plus\");
        return _result; 
    },
    
    Param_star : function (_name,_k) { 
        _ruleEnter (\"Param_star\");

        var name = _name._rwr ();
        var k = _k._rwr ();
        var _result = `\\n${name} = ${name}._rwr ().join (\'\');`; 
        _ruleExit (\"Param_star\");
        return _result; 
    },
    
    Param_opt : function (_name,_k) { 
        _ruleEnter (\"Param_opt\");

        var name = _name._rwr ();
        var k = _k._rwr ();
        var _result = `\\n${name} = ${name}._rwr ().join (\'\');`; 
        _ruleExit (\"Param_opt\");
        return _result; 
    },
    
    Param_flat : function (_name) { 
        _ruleEnter (\"Param_flat\");

        var name = _name._rwr ();
        var _result = `\\n${name} = ${name}._rwr ();`; 
        _ruleExit (\"Param_flat\");
        return _result; 
    },
    
    ////

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
};
"

*/

rwr_grammar := ""
rwr_semobject := ""
rwr_support_js := ""

hard_coded_rwr_grammar_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("hard_coded_rwr_grammar (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_rwr_grammar_proc)
}

hard_coded_rwr_semantics_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("hard_coded_rwr_semantics (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_rwr_semantics_proc)
}

hard_coded_rwr_support_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("hard_coded_rwr_support (ID:%d)", counter)
    return zd.make_leaf(name_with_id, hard_coded_rwr_support_proc)
}

hard_coded_rwr_grammar_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", rwr_grammar)
}
hard_coded_rwr_semantics_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", rwr_semobject)
}
hard_coded_rwr_support_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", rwr_support_js)
}

///
bang_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("bang (ID:%d)", counter)
    return zd.make_leaf(name_with_id, bang_proc)
}

bang_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", true)
}

///
Concat_Instance_Data :: struct {
    buffer : string,
}

empty_string := ""

concat_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("concat (ID:%d)", counter)
    inst := new (Concat_Instance_Data)
    inst.buffer = strings.clone (empty_string)
    return zd.make_leaf_with_data (name_with_id, inst, concat_proc)
}

concat_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Concat_Instance_Data) {
    switch (msg.port) {
    case "str":
	delete (inst.buffer)
	inst.buffer = fmt.aprintf ("%s%s", inst.buffer, msg.datum.(string))
    case "flush":
	zd.send(eh, "str", inst.buffer)
	delete (inst.buffer)
	inst.buffer = ""
    }
}

////
ohmjs0_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("ohmjs0 (ID:%d)", counter)
    return zd.make_leaf (name_with_id, ohmjs0_proc)
}

ohmjs0_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    switch (msg.port) {
    case "args":
	fmt.printf ("ohmjs0 gets grammar: %v\n", msg.datum.(string))
    case "stdin":
	fmt.printf ("ohmjs0 gets stdin: %v\n", msg.datum.(string))
    }
}

////

vc_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("vc (ID:%d)", counter)
    return zd.make_leaf(name_with_id, vc_proc)
}

vc_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "VirtualComma")
}


vcohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("vcohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, vcohm_proc)
}

vcohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/virtualcomma.ohm")
}

vcjs_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("vcjs (ID:%d)", counter)
    return zd.make_leaf(name_with_id, vcjs_proc)
}

vcjs_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/virtualcomma.js")
}

OhmJS_Instance_Data :: struct {
    grammarname : string, // grammar name
    grammarfilename : string, // file name of grammar in ohm-js format
    semanticsfilename : string, // file name of source text of semantics support code JavaScript namespace
    input : string, // source file to be parsed
}

ohmjs_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("OhmJS (ID:%d)", counter)
    inst := new (OhmJS_Instance_Data) // all fields have zero value before any messages are received
    return zd.make_leaf_with_data (name_with_id, inst, ohmjs_proc)
}

ohmjs_maybe :: proc (eh: ^zd.Eh, inst: ^OhmJS_Instance_Data) {
    if "" != inst.grammarname && "" != inst.grammarfilename && "" != inst.semanticsfilename && "" != inst.input {

        c := "pwd"
	o, e := process.run_command (c, inst.input)

        cmd := fmt.aprintf ("./ohmjs.js %s %s %s", inst.grammarname, inst.grammarfilename, inst.semanticsfilename)
	captured_output, err := process.run_command (cmd, inst.input)
	if err == "" {
            zd.send(eh, "output", captured_output)
	} else {
	    zd.send (eh, "error", err)
	}
    }
}

ohmjs_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^OhmJS_Instance_Data) {
    switch (msg.port) {
    case "grammar name":
	inst.grammarname = strings.clone (msg.datum.(string))
	ohmjs_maybe (eh, inst)
    case "grammar":
	inst.grammarfilename = strings.clone (msg.datum.(string))
	ohmjs_maybe (eh, inst)
    case "semantics":
	inst.semanticsfilename = strings.clone (msg.datum.(string))
	ohmjs_maybe (eh, inst)
    case "input":
	inst.input = strings.clone (msg.datum.(string))
	ohmjs_maybe (eh, inst)
     case:
        emsg := fmt.aprintf("!!! ERROR: OhmJS got an illegal message port %v", msg.port)
	zd.send(eh, "error", emsg)
    }
}

////

/// RWR rewriter generates semantics from .rwr spec

rwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("vc (ID:%d)", counter)
    return zd.make_leaf(name_with_id, rwr_proc)
}
rwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "RWR")
}
rwrohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("rwrohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, rwrohm_proc)
}
rwrohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "rwr.ohm")
}
rwrsemjs_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("rwrsemjs (ID:%d)", counter)
    return zd.make_leaf(name_with_id, rwrsemjs_proc)
}
rwrsemjs_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "rwr.sem.js")
}

///
escapes_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("escapes (ID:%d)", counter)
    return zd.make_leaf(name_with_id, escapes_proc)
}
escapes_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "Escapes")
}
escapesohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("escapesohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, escapesohm_proc)
}
escapesohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/escapes.ohm")
}
escapesrwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("escapesrwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, escapesrwr_proc)
}
escapesrwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/escapes.rwr")
}

//

/* Syncfilewrite_Data :: struct { */
/*     filename : string */
/* } */

// temp copy for bootstrap, sends "done" (error during bootstrap if not wired)

syncfilewrite2_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("syncfilewrite2 (ID:%d)", counter)
    inst := new (Syncfilewrite_Data)
    return zd.make_leaf(name_with_id, inst, syncfilewrite2_proc)
}

syncfilewrite2_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Syncfilewrite_Data) {
    switch msg.port {
    case "filename":
	inst.filename = msg.datum.(string)
    case "input":
	contents := msg.datum.(string)
	ok := os.write_entire_file (inst.filename, transmute([]u8)contents, true)
	if !ok {
	    zd.send (eh, "error", "write error")
	}
	zd.send (eh, "done", true)
    }
}

fakepipename_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("fakepipename (ID:%d)", counter)
    inst := new (Syncfilewrite_Data)
    return zd.make_leaf(name_with_id, inst, fakepipename_proc)
}

fakepipename_proc :: proc(eh: ^zd.Eh, msg: zd.Message, inst: ^Syncfilewrite_Data) {
    @(static) rand := 0
    rand += 1
    zd.send (eh, "output", fmt.aprintf ("/tmp/fakepipename%d", rand))
}


///

///
unquote_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("unquote (ID:%d)", counter)
    return zd.make_leaf(name_with_id, unquote_proc)
}
unquote_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "Unquote")
}
unquoteohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("unquoteohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, unquoteohm_proc)
}
unquoteohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/unquote.ohm.m4")
}
unquoterwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("unquoterwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, unquoterwr_proc)
}
unquoterwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/unquote.rwr.m4")
}
///
constants_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("constants (ID:%d)", counter)
    return zd.make_leaf(name_with_id, constants_proc)
}
constants_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "Constants")
}
constantsohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("constantsohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, constantsohm_proc)
}
constantsohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/constants.ohm.m4")
}
constantsrwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("constantsrwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, constantsrwr_proc)
}
constantsrwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolog/constants.rwr.m4")
}

///
symrewrites_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("symrewrites (ID:%d)", counter)
    return zd.make_leaf(name_with_id, symrewrites_proc)
}
symrewrites_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "SymRewrites")
}
symrewritesohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("symrewritesohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, symrewritesohm_proc)
}
symrewritesohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/symrewrites.ohm.m4")
}
symrewritesrwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("symrewritesrwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, symrewritesrwr_proc)
}
symrewritesrwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/symrewrites.rwr.m4")
}

///
listrewrites_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("listrewrites (ID:%d)", counter)
    return zd.make_leaf(name_with_id, listrewrites_proc)
}
listrewrites_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "ListRewrites")
}
listrewritesohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("listrewritesohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, listrewritesohm_proc)
}
listrewritesohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/listrewrites.ohm.m4")
}
listrewritesrwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("listrewritesrwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, listrewritesrwr_proc)
}
listrewritesrwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/listrewrites.rwr.m4")
}

///
macro_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("macro (ID:%d)", counter)
    return zd.make_leaf(name_with_id, macro_proc)
}
macro_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "JSMacro")
}
macroohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("macroohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, macroohm_proc)
}
macroohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/macro.ohm.m4")
}
macrorwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("macrorwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, macrorwr_proc)
}
macrorwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "prolosjs/macro.rwr.m4")
}

///
exprstatements_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("exprstatements (ID:%d)", counter)
    return zd.make_leaf(name_with_id, exprstatements_proc)
}
exprstatements_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "ExprStatements")
}
exprstatementsohm_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("exprstatementsohm (ID:%d)", counter)
    return zd.make_leaf(name_with_id, exprstatementsohm_proc)
}
exprstatementsohm_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/exprstatements.ohm.m4")
}
exprstatementsrwr_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("exprstatementsrwr (ID:%d)", counter)
    return zd.make_leaf(name_with_id, exprstatementsrwr_proc)
}
exprstatementsrwr_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/exprstatements.rwr.m4")
}
exprstatementssupport_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("exprstatementssupport (ID:%d)", counter)
    return zd.make_leaf(name_with_id, exprstatementssupport_proc)
}
exprstatementssupport_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", "js/exprstatementssupport.js")
}

///

colonspc_instantiate :: proc(name: string) -> ^zd.Eh {
    @(static) counter := 0
    counter += 1

    name_with_id := fmt.aprintf("colonspc (ID:%d)", counter)
    return zd.make_leaf(name_with_id, colonspc_proc)
}
colonspc_proc :: proc(eh: ^zd.Eh, msg: zd.Message) {
    zd.send(eh, "output", ": ")
}
