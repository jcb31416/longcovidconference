// @/app/api/central/route.js

import { NextResponse }                     from "next/server";
import {
  funbck_getwebinar,
  funbck_getdetailspeakers,
  funbck_admin_refreshcache,
  funbck_registerrequest,
  funbck_sendtocontact,
  // funbck_test,
}                                           from "@/utils/back/mod_back";

// === helpers ===========================================================
const fun_fail = (e) => NextResponse.json({ ok:false, err: String(e.message) }, { status: 500 });
// ======================================================================

export async function POST(request) {
  try {
    const form_1                            = await request.formData();
    const dic_in                            = Object.fromEntries(form_1.entries());
    const str_fun                           = dic_in.str_fun || "";

    let resp;
    if (     str_fun === "funbck_getwebinar")               resp = await funbck_getwebinar(dic_in);//resp = await funbck_savewebinar(dic_in);
    else if (str_fun === "funbck_getdetailspeakers")        resp = await funbck_getdetailspeakers(dic_in);
    else if (str_fun === "funbck_admin_refreshcache")       resp = await funbck_admin_refreshcache(dic_in);
    else if (str_fun === "funbck_registerrequest")          resp = await funbck_registerrequest(dic_in, request);
    else if (str_fun === "funbck_sendtocontact")            resp = await funbck_sendtocontact(dic_in, request);

    // else if (str_fun === "funbck_test")                     resp = await funbck_test(dic_in);
    // else if (str_fun === "funchn_seeprices")        resp = await funchn_seeprices(dic_in);
    // else if (str_fun === "funchn_seescore_batch")   resp = await funchn_seescore_batch(dic_in);
    // else if (str_fun === "funchn_seelisdom")        resp = await funchn_seelisdom(dic_in);
    //
    // else if (str_fun === "funapi_stripepay")        resp = await funapi_stripepay(dic_in);
    else                                    return NextResponse.json({ ok:false, err:"unknown str_fun" }, { status: 400 });

    return NextResponse.json({ ok:true, resp });
  } catch (e) {
    return fun_fail(e);
  }
}//end POST
