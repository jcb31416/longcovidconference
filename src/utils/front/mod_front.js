
const SET_SKIP = new Set(["str_api", "form", "dic", "str_fun", "u_logged", "dic_wal"]);




function fun2_payload2form(form, dic_payload) {
    const isFileLike = (x) =>
        (typeof File !== "undefined" && x instanceof File) ||
        (typeof Blob !== "undefined" && x instanceof Blob);

    const fun3_replacer = (_k, v) => (typeof v === "bigint" ? v.toString() : v);

    for (const [str_key, var_value] of Object.entries(dic_payload || {})) {
        if (var_value === undefined || var_value === null) {
            continue;
        } //endif

        if (isFileLike(var_value)) {
            form.set(str_key, var_value);
            continue;
        } //endif

        if (typeof var_value === "bigint") {
            form.set(str_key, var_value.toString());
            continue;
        } //endif

        if (Array.isArray(var_value) || (typeof var_value === "object" && !(var_value instanceof Date))) {
            form.set(str_key, JSON.stringify(var_value, fun3_replacer));
            continue;
        } //endif

        if (var_value instanceof Date) {
            form.set(str_key, var_value.toISOString());
            continue;
        } //endif

        form.set(str_key, String(var_value));
    } //endfor

    return form;
} //endfun fun2_payload2form




export function fun2_diggest_in(dic_in) {
    const str_fun                       = dic_in?.str_fun;

    if (!str_fun) {
        throw new Error("fun2_diggest_in: missing str_fun");
    } //endif

    const boo_has_dic                   = !!(dic_in?.dic && typeof dic_in.dic === "object");
    const boo_has_form                  = !!(dic_in?.form instanceof FormData);

    if (!boo_has_dic && !boo_has_form) {
        debugger;
        throw new Error("fun2_diggest_in: missing dic or form");
    } //endif no input

    let dic_payload                     = {};
    let dic_meta                        = {};
    let form                            = boo_has_form ? dic_in.form : new FormData();

    if (boo_has_dic) {
        dic_payload                     = Object.fromEntries(
            Object.entries(dic_in.dic).filter(([str_key]) => !SET_SKIP.has(str_key))
        );

        const { u_logged, dic_wal }     = dic_in.dic;
        dic_meta                        = { u_logged, dic_wal, str_fun };

        fun2_payload2form(form, dic_payload);
    } else {
        dic_payload                     = Object.fromEntries(form.entries());
        dic_meta                        = { str_fun };
    } //endif source kind

    form.set("str_fun", String(str_fun));

    return { dic_meta, form, dic_payload };
} //endfun fun2_diggest_in






// MOD: fun_fetch ya NO hace auth ni firma: solo POST
export async function fun_fetch(dic_in) {
  const { form }                                = fun2_diggest_in(dic_in);

  const str_api                                 = String(dic_in?.str_api || "").trim();
  const resp_http                               = await fetch(str_api, { method:"POST", body:form });

  const str_ct                                  = resp_http.headers.get("content-type") || "";
  let dic_out;

  if (str_ct.includes("application/json")) {
    dic_out                                     = await resp_http.json();
  } else {
    const str_txt                               = await resp_http.text();
    try { dic_out = JSON.parse(str_txt); }
    catch { dic_out = { ok:false, err:str_txt }; }
  }

  if (!resp_http.ok || dic_out?.ok === false) {
    debugger; // fun_fetch mod_frontend
    const str_err = String(dic_out?.err || dic_out?.message || `HTTP ${resp_http.status}`);
    throw new Error(str_err);
  }

  return dic_out;
}//endfun fun_fetch
