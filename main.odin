package coroutines

import "core:fmt"
import "core:log"
import "core:strings"
import "core:slice"
import "core:os"
import "core:unicode/utf8"

import reg "registry0d"
import "process"
import "syntax"
import zd "0d"
import user "user0d"
import leaf "leaf0d"

import "decompress"
import "parser"

main :: proc() {

    if user.start_logger () {
	fmt.println ("*** starting logger ***")
	context.logger = log.create_console_logger(
            opt={.Level, .Time, .Terminal_Color},
	)
    }

    // load arguments
    diagram_source_file := slice.get(os.args, 1) or_else "coroutines.drawio"
    main_container_name := slice.get(os.args, 2) or_else "main"

    if !os.exists(diagram_source_file) {
        fmt.println("Source diagram file", diagram_source_file, "does not exist.")
        os.exit(1)
    }

    // set up shell leaves
    leaves := make([dynamic]reg.Leaf_Instantiator)

    leaf.collect_process_leaves(diagram_source_file, &leaves)

    // export native leaves
    reg.append_leaf (&leaves, reg.Leaf_Instantiator {
        name = "stdout",
        init = leaf.stdout_instantiate,
    })

    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "HardCodedGrammar", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "HardCodedSemantics", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "HardCodedSupport", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "1then2", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "Bang", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "concat", init = ???.instantiate })
    reg.append_leaf (&leaves, reg.Leaf_Instantiator { name = "ohmjs", init = ???.instantiate })

    user.components (&leaves)

    regstry := reg.make_component_registry(leaves[:], diagram_source_file)

    run (regstry, main_container_name, diagram_source_file, inject0)
    run (regstry, main_container_name, diagram_source_file, inject1)
    run (regstry, main_container_name, diagram_source_file, injectperiod)
    run (regstry, main_container_name, diagram_source_file, injectw)
    run (regstry, main_container_name, diagram_source_file, injectwperiod)
    run (regstry, main_container_name, diagram_source_file, inject13)
}

run :: proc (regstry : reg.Component_Registry, main_container_name : string, diagram_source_file : string, injectfn : #type proc (^zd.Eh)) {
    // get entrypoint container
    main_container, ok := reg.get_component_instance(regstry, main_container_name)
    fmt.assertf(
        ok,
        "Couldn't find main container with page name %s in file %s (check tab names, or disable compression?)\n",
        main_container_name,
        diagram_source_file,
    )
    injectfn (main_container)
    fmt.println("--- Outputs ---")
    zd.print_output_list(main_container)
}

inject0 :: proc (main_container : ^zd.Eh) {
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}

inject1 :: proc (main_container : ^zd.Eh) {
    main_container.handler(main_container, zd.make_message("c", 'z'))
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}

injectperiod :: proc (main_container : ^zd.Eh) {
    main_container.handler(main_container, zd.make_message("c", '.'))
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}

injectw :: proc (main_container : ^zd.Eh) {
    main_container.handler(main_container, zd.make_message("c", 'ω'))
    main_container.handler(main_container, zd.make_message("c", cast(rune)10))
    main_container.handler(main_container, zd.make_message("c", 'U'))
    main_container.handler(main_container, zd.make_message("c", 'v'))
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}

injectwperiod :: proc (main_container : ^zd.Eh) {
    main_container.handler(main_container, zd.make_message("c", 'ω'))
    main_container.handler(main_container, zd.make_message("c", cast(rune)3))
    main_container.handler(main_container, zd.make_message("c", '.'))
    main_container.handler(main_container, zd.make_message("c", 'p'))
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}


inject13 :: proc (main_container : ^zd.Eh) {
    // 1. inject a test message, observe the output
    main_container.handler(main_container, zd.make_message("c", 'a'))
    main_container.handler(main_container, zd.make_message("c", 'b'))
    main_container.handler(main_container, zd.make_message("c", 'c'))
    main_container.handler(main_container, zd.make_message("c", '.'))
    main_container.handler(main_container, zd.make_message("c", 'd'))
    main_container.handler(main_container, zd.make_message("c", 'e'))
    main_container.handler(main_container, zd.make_message("c", 'f'))
    main_container.handler(main_container, zd.make_message("c", '!'))
    main_container.handler(main_container, zd.make_message("c", 'ω'))
    main_container.handler(main_container, zd.make_message("c", cast(rune)5))
    main_container.handler(main_container, zd.make_message("c", 'Y'))
    main_container.handler(main_container, zd.make_message("c", 'z'))
    main_container.handler(main_container, zd.make_message("c", '⊥'))
}
