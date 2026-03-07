"use client";

import { useMemo, useState }            from "react";
import GlassPanel                       from "@/components/GlassPanel.jsx";
import { fun_fetch }                    from "@/utils/front/mod_front.js";
import Link                             from "next/link";

const str_cn_select                     =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm " +
    "text-zinc-100 outline-none focus:ring-2 focus:ring-white/20";

const str_cn_textarea                   =
    "w-full min-h-[140px] resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm " +
    "text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20";

const str_cn_label                      = "text-sm font-semibold";
const str_cn_rlabel                     = "text-xs italic text-zinc-500";

export default function ContactPage() {
    const int_max                       = 300;

    const [dic_form, setForm]           = useState({
        field                           : "speaker",
        tag                             : "science",
        observations                    : "",
    });

    const [boo_sending, setSending]     = useState(false);
    const [str_msg, setMsg]             = useState("");

    const int_left                      = int_max - dic_form.observations.length;

    const boo_can_submit                =
        dic_form.observations.trim() &&
        !boo_sending;

    const fun_set                       = (str_key) => (eve_input) =>
        setForm((dic_prev) => ({
            ...dic_prev,
            [str_key]                   : eve_input.target.value,
        }));

    const fun_submit                    = async (eve_submit) => {
        eve_submit.preventDefault();
        setMsg("");

        if (!boo_can_submit) {
            setMsg("Please write a message.");
            return;
        } //endif invalid submit

        try {
            setSending(true);

            const dic_out               = await fun_fetch({
                str_api                 : "/api/central",
                str_fun                 : "funbck_sendtocontact",
                dic                     : dic_form,
            });

            if (!dic_out.ok) {
                throw new Error(dic_out.err || "Contact send failed.");
            } //endif not ok

            setMsg("✅ Sent. We usually reply within 24–48h.");

            setForm({
                field                   : "business",
                tag                     : "sponsor",
                observations            : "",
            });
        } catch (err) {
            setMsg(String(err?.message ?? err));
        } finally {
            setSending(false);
        } //endtry fun_submit
    }; //endfun fun_submit

    return (
        <main className="relative min-h-screen">

            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel str_tint="purple" className="w-full max-w-4xl px-8 py-8">
                    <h1 className="text-3xl font-semibold">
                        Contact
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        Send us a short message and we&apos;ll get back to you.
                    </p>

                    <form onSubmit={fun_submit}>
                        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Field */}
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <div className={str_cn_label}>
                                        field
                                    </div>

                                    <div className={str_cn_rlabel}>
                                        what is this about?
                                    </div>
                                </div>

                                <select
                                    className={str_cn_select}
                                    value={dic_form.field}
                                    onChange={fun_set("field")}
                                >
                                    <option value="science">science</option>
                                    <option value="business">business</option>
                                    <option value="support">support</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                            {/* End Field */}

                            {/* Priority tag */}
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <div className={str_cn_label}>
                                        priority tag
                                    </div>

                                    <div className={str_cn_rlabel}>
                                        which tag describes you best?
                                    </div>
                                </div>

                                <select
                                    className={str_cn_select}
                                    value={dic_form.tag}
                                    onChange={fun_set("tag")}
                                >
                                    <option value="speaker">speaker</option>
                                    <option value="press">press</option>
                                    <option value="general">general</option>
                                </select>
                            </div>
                            {/* End Priority tag */}

                            {/* Observations */}
                            <div className="md:col-span-2">
                                <div className="flex items-baseline justify-between">
                                    <div className={str_cn_label}>
                                        observations
                                    </div>

                                    <div className={str_cn_rlabel}>
                                        max {int_max} chars
                                    </div>
                                </div>

                                <textarea
                                    className={str_cn_textarea}
                                    value={dic_form.observations}
                                    placeholder="Write your message..."
                                    onChange={(eve_change) =>
                                        setForm((dic_prev) => ({
                                            ...dic_prev,
                                            observations    : eve_change.target.value.slice(0, int_max),
                                        }))
                                    }
                                />

                                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                                    <div>
                                        {int_left} left
                                    </div>

                                    <div>
                                        {dic_form.observations.length}/{int_max}
                                    </div>
                                </div>
                            </div>
                            {/* End Observations */}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={!boo_can_submit}
                                    className={[
                                        "rounded-xl px-6 py-2 text-sm font-semibold transition",
                                        boo_can_submit
                                            ? "border border-white/15 bg-white/10 hover:bg-white/15"
                                            : "cursor-not-allowed border border-white/10 bg-white/5 text-zinc-500",
                                    ].join(" ")}
                                >
                                    {boo_sending ? "Sending..." : "Send"}
                                </button>

                                <div className="text-sm text-zinc-400">
                                    {str_msg || "We usually reply within 24–48h."}
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                            >
                                Back
                            </Link>
                        </div>
                        {/* End Actions */}
                    </form>
                </GlassPanel>
            </div>
        </main>
    );
} //endfun ContactPage
