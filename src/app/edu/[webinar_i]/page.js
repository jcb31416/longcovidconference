'use client';

import Panel                            from '@/components/Panel.jsx';
import Panelistas                       from '@/components/Panelistas.jsx';
import { useEffect, useState }          from "react";
import { fun_fetch }                    from "@/utils/front/mod_front"; // adjust path if different
import { useParams }                    from "next/navigation";

export default function Webinar() {
  const params                          = useParams();
  const [dic_panel, set_panel]          = useState(null);

  useEffect(() => {

    const fun_getwebinar = async () => {

      // build form
      const form_1 = new FormData();
      // form_1.set(  "body",  JSON.stringify(dic_panel_local)  ); // ✅ must be string
      form_1.set("slug", params.webinar_i);
      // fun_fetch already appends str_fun in your util
      // const resp = await fun_fetch({ str_api: "/api/central",  form: form_1,  str_fun: "funbck_savewebinar" });
      const resp = await fun_fetch({ str_api: "/api/central",  form: form_1,  str_fun:"funbck_getwebinar" });

      // if your API returns { ok:true, resp: ... }
      // you can keep local panel for rendering, and optionally use out.resp
      set_panel(resp.resp);
    }; //endfun fun_savewebinar

    fun_getwebinar().catch((e) => console.error("DB update failed:", e));
  }, [params.webinar_i]);

  if (!dic_panel) return null;




  return (
    <>
      <Panel
        dic_webinar= { dic_panel }
        str_viewmode={"full"}
      />
    </>

  ); // end return
}//end page Webinar
