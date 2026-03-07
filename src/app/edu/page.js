'use client';

import { useEffect, useState }        from "react";
import Panel                          from '@/components/Panel.jsx';
import { fun_fetch }                  from "@/utils/front/mod_front";

export default function Webinars() {

  const [lsd_webinars, set_webinars] = useState([]);

  useEffect(() => {
    async function fun_getwebinars() {
      const form_1 = new FormData();
      form_1.set("slug", "all");
      const resp = await fun_fetch({ str_api: "/api/central", form: form_1, str_fun: "funbck_getwebinar" });
      set_webinars(resp.resp ?? []);
    }//end fun_getwebinars
    fun_getwebinars().catch(console.error);
  }, []);


  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Academy</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Dashboard de eventos académicos</p>

      <div className="mt-8 flex flex-col gap-6">
        {lsd_webinars.map((w) => (
          <Panel key={w.slug ?? w._id} dic_webinar={w} str_viewmode="vprevia" />
        ))}
      </div>
    </main>
  );
}
