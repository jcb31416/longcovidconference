export function funfro_parse_program_markdown(str_md_in = "") {



    function clean(str_value) {
        return String(str_value ?? "").replace(/\r/g, "").trim();
    } //endfun clean




    function fun_norm_dash(str_value) {
        return String(str_value ?? "").replace(/[–—]/g, "-");
    } //endfun fun_norm_dash

    function fun_is_hr(str_line) {
        return /^\s*---+\s*$/.test(str_line);
    } //endfun fun_is_hr

    function fun_is_h3_program(str_line) {
        return /^\s*#{3}\s+Programa\s*$/i.test(str_line);
    } //endfun fun_is_h3_program

    function fun_is_h3_structure(str_line) {
        return /^\s*#{3}\s+Estructura\s*$/i.test(str_line);
    } //endfun fun_is_h3_structure

    function fun_is_h4_block(str_line) {
        return /^\s*#{4}\s+/.test(str_line);
    } //endfun fun_is_h4_block

    function fun_parse_block_title(str_line) {
        return clean(str_line.replace(/^\s*#{4}\s+/, ""));
    } //endfun fun_parse_block_title




    function fun_parse_session_header(str_line) {
        const str_line_clean          = clean(str_line);

        if (!str_line_clean.startsWith("**")) {
            return null;
        } //endif

        const mat_header              = str_line_clean.match(/^\*\*(.+?)\*\*(.*)$/);

        if (!mat_header) {
            return null;
        } //endif

        const str_bold_inner          = clean(mat_header[1]);
        const str_after_bold          = clean(mat_header[2]);

        const mat_main                = str_bold_inner.match(/^([0-9]{2}:[0-9]{2}\s*[-–—]\s*[0-9]{2}:[0-9]{2})\s*·\s*(.+)$/);

        if (!mat_main) {
            return null;
        } //endif

        const str_time_raw            = clean(mat_main[1]);
        const str_title_raw           = clean(mat_main[2]);

        let str_title                 = str_title_raw;
        let str_inline_note           = "";

        if (str_after_bold) {
            str_inline_note           = str_after_bold.replace(/^\./, "").trim();
        } //endif

        return {
            str_time                  : fun_norm_dash(str_time_raw),
            str_title,
            str_inline_note,
        };
    } //endfun fun_parse_session_header




    const lis_lines                   = String(str_md_in ?? "").replace(/\r/g, "").split("\n");

    let boo_in_program                = false;
    let boo_in_structure              = false;

    let str_timezone_note             = "";
    let str_structure_md              = "";

    const lis_blocks                  = [];
    let dic_block_current             = null;
    let dic_item_current              = null;




    function fun_push_item_current() {
        if (!dic_item_current) {
            return;
        } //endif

        dic_item_current.description  = clean(dic_item_current.description);

        if (!dic_item_current.str_type) {
            dic_item_current.str_type = /^minicoloquio/i.test(dic_item_current.title)
                ? "discussion"
                : /^coloquio/i.test(dic_item_current.title)
                    ? "closing"
                    : /^inauguraci[oó]n/i.test(dic_item_current.title)
                        ? "opening"
                        : "talk";
        } //endif

        if (!dic_block_current) {
            dic_block_current         = {
                title                 : "Programa",
                lis_items             : [],
            };
            lis_blocks.push(dic_block_current);
        } //endif

        dic_block_current.lis_items.push(dic_item_current);
        dic_item_current             = null;
    } //endfun fun_push_item_current




    function fun_push_block_current() {
        fun_push_item_current();

        if (!dic_block_current) {
            return;
        } //endif

        if (!Array.isArray(dic_block_current.lis_items)) {
            dic_block_current.lis_items = [];
        } //endif

        dic_block_current            = null;
    } //endfun fun_push_block_current




    for (const str_line_raw of lis_lines) {
        const str_line               = str_line_raw.replace(/\s+$/, "");
        const str_line_trim          = clean(str_line);

        if (!boo_in_program && !boo_in_structure) {
            if (fun_is_h3_program(str_line_trim)) {
                boo_in_program       = true;
                continue;
            } //endif

            if (str_line_trim) {
                str_timezone_note    += (str_timezone_note ? "\n" : "") + str_line_trim;
            } //endif

            continue;
        } //endif pre-program

        if (boo_in_program) {
            if (fun_is_h3_structure(str_line_trim)) {
                fun_push_block_current();
                boo_in_program       = false;
                boo_in_structure     = true;
                continue;
            } //endif

            if (!str_line_trim) {
                if (dic_item_current?.description) {
                    dic_item_current.description += "\n";
                } //endif
                continue;
            } //endif blank

            if (fun_is_hr(str_line_trim)) {
                continue;
            } //endif hr

            if (fun_is_h4_block(str_line_trim)) {
                fun_push_block_current();

                dic_block_current    = {
                    title            : fun_parse_block_title(str_line_trim),
                    lis_items        : [],
                };

                lis_blocks.push(dic_block_current);
                continue;
            } //endif block

            const dic_header         = fun_parse_session_header(str_line_trim);

            if (dic_header) {
                fun_push_item_current();

                dic_item_current     = {
                    time             : dic_header.str_time,
                    title            : dic_header.str_title,
                    description      : dic_header.str_inline_note || "",
                    str_type         : null,
                };

                continue;
            } //endif session header

            if (!dic_item_current) {
                // líneas sueltas bajo bloque, como "(voluntario, según disponibilidad)"
                if (dic_block_current) {
                    dic_block_current.subtitle =
                        clean(
                            [dic_block_current.subtitle, str_line_trim].filter(Boolean).join("\n")
                        );
                } //endif
                continue;
            } //endif loose line inside block

            dic_item_current.description =
                clean(
                    [dic_item_current.description, str_line_trim].filter(Boolean).join("\n")
                );
        } //endif boo_in_program

        else if (boo_in_structure) {
            if (str_line_trim) {
                str_structure_md     += (str_structure_md ? "\n" : "") + str_line_trim;
            } //endif
        } //endif boo_in_structure
    } //endfor




    fun_push_block_current();




    return {
        timezone_note                : clean(str_timezone_note),
        lis_blocks,
        structure_md                 : clean(str_structure_md),
    };
} //endfun funfro_parse_program_markdown
