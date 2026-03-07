"use client";

import { useState }                     from "react";
import GlassPanel                       from "@/components/GlassPanel.jsx";


const str_cn_select                     =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm " +
    "text-zinc-100 outline-none focus:ring-2 focus:ring-white/20";


const str_cn_textarea                   =
    "w-full min-h-[140px] resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm " +
    "text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20";



export default function ContactPage() {
    const [str_field, setField]         = useState("business");
    const [str_tag, setTag]             = useState("sponsor");
    const [str_msg, setMsg]             = useState("");
    const int_max                       = 300;

    const int_left                      = int_max - str_msg.length;

    const fun_send                      = async () => {
        // placeholder: tú lo conectas a tu API cuando quieras
        alert("Sending...");
        const dic_ou = await fun_fetch({  str_api:"central/api",  str_fun:"funbck_sendtocontact",  dic:dic_form  });

        if (!dic_ou.ok) {
          throw new Error(`contactpage: ${dic_ou.err}`);
        }//endif nok
        setMsg("Sended");
    }; //endfun fun_send



    return (
        <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel className="w-full max-w-4xl px-8 py-8">
                    <h1 className="text-3xl font-semibold">
                        Contact
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        Send us a short message and we&apos;ll get back to you.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Field */}
                        <div>
                            <div className="flex items-baseline justify-between">
                                <div className="text-sm font-semibold">
                                    field
                                </div>

                                <div className="text-xs italic text-zinc-500">
                                    what is this about?
                                </div>
                            </div>

                            <select
                                className={str_cn_select}
                                value={str_field}
                                onChange={(eve_change) => setField(eve_change.target.value)}
                            >
                                <option value="business">business</option>
                                <option value="science">science</option>
                                <option value="support">support</option>
                                <option value="other">other</option>
                            </select>
                        </div>
                        {/* End Field */}

                        {/* Priority tag */}
                        <div>
                            <div className="flex items-baseline justify-between">
                                <div className="text-sm font-semibold">
                                    priority tag
                                </div>

                                <div className="text-xs italic text-zinc-500">
                                    which tag describes you best?
                                </div>
                            </div>

                            <select
                                className={str_cn_select}
                                value={str_tag}
                                onChange={(eve_change) => setTag(eve_change.target.value)}
                            >
                                <option value="sponsor">sponsor</option>
                                <option value="speaker">speaker</option>
                                <option value="press">press</option>
                                <option value="general">general</option>
                            </select>
                        </div>
                        {/* End Priority tag */}

                        {/* Observations */}
                        <div className="md:col-span-2">
                            <div className="flex items-baseline justify-between">
                                <div className="text-sm font-semibold">
                                    observations
                                </div>

                                <div className="text-xs italic text-zinc-500">
                                    max {int_max} chars
                                </div>
                            </div>

                            <textarea
                                className={str_cn_textarea}
                                value={str_msg}
                                placeholder="Write your message..."
                                onChange={(eve_change) => setMsg(eve_change.target.value.slice(0, int_max))}
                            />

                            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                                <div>
                                    {int_left} left
                                </div>

                                <div>
                                    {str_msg.length}/{int_max}
                                </div>
                            </div>
                        </div>
                        {/* End Observations */}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={fun_send}
                            className="rounded-xl border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold hover:bg-white/15"
                        >
                            Send
                        </button>

                        <div className="text-sm text-zinc-400">
                            We usually reply within 24–48h.
                        </div>
                    </div>
                    {/* End Actions */}
                </GlassPanel>
            </div>
        </main>
    );
} //endfun ContactPage
