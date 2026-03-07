"use client";

import { useMemo, useState }            from "react";
import Link                             from "next/link";
import GlassPanel                       from "@/components/GlassPanel.jsx";
import MDrenderer                       from "@/components/MDrenderer.jsx";
import md_terms                         from "@/content/md_terms.js";
import {fun_fetch}                      from "@/utils/front/mod_front.js";

const str_cn_input                      =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm " +
    "text-zinc-100 placeholder:text-zinc-500 outline-none " +
    "focus:ring-2 focus:ring-white/20";

const str_cn_label                      = "text-xs font-semibold uppercase tracking-widest text-zinc-400";
const str_cn_rlabel                     = "text-xs italic text-zinc-500";






export default function RegisterPage() {
    const [dic_form, setForm]           = useState({
        name                            : "",
        surname                         : "",
        email                           : "",
        affiliation                     : "",
        profession                      : "",
        talkTitle                       : "",
        merits                          : "",
        observations                    : "",
    });

    const [boo_terms, setTerms]         = useState(false);
    const [boo_modal, setModal]         = useState(false);
    const [boo_sending, setSending]     = useState(false);
    const [str_msg, setMsg]             = useState("");
    // const [str_colormsg, set_colormsg]  = useState("");



    const boo_valid_email               = useMemo(() => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dic_form.email.trim());
    }, [dic_form.email]);



    const boo_can_submit                =
        dic_form.name.trim() &&
        dic_form.surname.trim() &&
        boo_valid_email &&
        dic_form.affiliation.trim() &&
        dic_form.profession.trim() &&
        boo_terms &&
        !boo_sending;



    const fun_set                       = (str_key) => (eve_input) =>
        setForm((dic_prev) => ({ ...dic_prev, [str_key]: eve_input.target.value }));



    const fun_submit                    = async (eve_submit) => {
        eve_submit.preventDefault();
        setMsg("");

        if (!boo_can_submit) {
            // set_colormsg("gray");
            setMsg("Please fill all required fields and accept Terms.");
            return;
        } //endif invalid submit

        try {
            setSending(true);

            const dic_out               = await fun_fetch({  str_api: "/api/central",  str_fun: "funbck_registerrequest",  dic: dic_form  });

            // const dic_out               = await obj_resp.json().catch(() => ({}));

            if (!dic_out.ok) {
                throw new Error(dic_out.err || "Register failed.");
            } //endif response invalid

            // set_colormsg("green");
            setMsg("✅ Submitted. If accepted, you will receive an email notification.");

            setForm({
                name                    : "",
                surname                 : "",
                email                   : "",
                affiliation             : "",
                profession              : "",
                talkTitle               : "",
                merits                  : "",
            });

            setTerms(false);
        } catch (err) {
            // set_colormsg("red");
            setMsg(String(err?.message ?? err));
        } finally {
            setSending(false);
        } //endtry fun_submit
    }; //endfun fun_submit






    return (
        <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-zinc-100">
                <GlassPanel str_tint="purple" className="w-full max-w-3xl px-8 py-8">
                    <h1 className="text-3xl font-semibold">
                        Register
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        Apply to participate. We’ll review your submission.
                    </p>

                    {/* Disclaimer */}
                    <div className="mt-6 rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-zinc-300">
                        <p className="italic">
                            ⚠️ Registering does not grant the right to be accepted. It only submits a request for admission.
                            If accepted, you will receive an acceptance notification to your email address.
                        </p>
                    </div>

                    <form onSubmit={fun_submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <div className={str_cn_label}>
                                Name
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="Jane"
                                value={dic_form.name}
                                onChange={fun_set("name")}
                            />
                        </div>

                        <div>
                            <div className={str_cn_label}>
                                Surname
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="Doe"
                                value={dic_form.surname}
                                onChange={fun_set("surname")}
                            />
                        </div>


                        <div className="sm:col-span-2">
                            <div className="flex items-baseline justify-between">
                                <div className={str_cn_label}>
                                    Email
                                </div>

                                <div className={str_cn_rlabel}>
                                    Please provide the email address where you wish to receive the acceptance/rejection notification.
                                </div>
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="jane.doe@university.edu"
                                value={dic_form.email}
                                onChange={fun_set("email")}
                                inputMode="email"
                            />
                        </div>


                        <div className="sm:col-span-2">
                            <div className={str_cn_label}>
                                Affiliation
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="Hospital / University / Organization"
                                value={dic_form.affiliation}
                                onChange={fun_set("affiliation")}
                            />
                        </div>


                        <div className="sm:col-span-2">
                            <div className={str_cn_label}>
                                Profession
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="MD, PhD, researcher, patient advocate..."
                                value={dic_form.profession}
                                onChange={fun_set("profession")}
                            />
                        </div>


                        {/* Label box "merits" */}
                        <div className="sm:col-span-2">

                            {/* Label row */}
                            <div className="flex items-baseline justify-between">
                                <div className={str_cn_label}>
                                    Merits
                                </div>

                                <div className={str_cn_rlabel}>
                                    Please help us to check your merits you want to highlight
                                </div>
                            </div>
                            {/* End Label row */}

                            {/* Input */}
                            <input
                                className={str_cn_input}
                                placeholder="Researchgate URL: ..., Scholar: ..., Linkedin: ..."
                                value={dic_form.merits}
                                onChange={fun_set("merits")}
                            />
                            {/* End Input */}

                        </div>
                        {/* end Label box "merits" */}


                        <div className="sm:col-span-2">
                            <div className={str_cn_label}>
                                Talk title
                            </div>

                            <input
                                className={str_cn_input}
                                placeholder="Working title of your proposal"
                                value={dic_form.talkTitle}
                                onChange={fun_set("talkTitle")}
                            />
                        </div>


                        {/* Terms */}
                        <div className="sm:col-span-2 mt-2 flex items-start gap-3">

                            <button
                              type="button"
                              aria-label="Toggle terms acceptance"
                              onClick={() => setTerms((v) => !v)}
                              className={[
                                "mt-1 flex h-5 w-5 items-center justify-center rounded-sm border transition",
                                boo_terms
                                  ? "border-blue-500 bg-blue-600"
                                  : "border-zinc-400/50 bg-black/30 hover:border-blue-400",
                              ].join(" ")}
                            >
                              {boo_terms ? (
                                <span className="block h-2.5 w-2.5 rounded-[2px] bg-white" />
                              ) : null}
                            </button>

                            <div className="text-sm text-zinc-300">
                                I accept{" "}

                                <button
                                    type="button"
                                    className="underline underline-offset-4 text-zinc-200"
                                    onClick={() => setModal(true)}
                                >
                                    terms and services
                                </button>

                                .

                                <div className="mt-1 text-xs text-zinc-500">
                                    Clicking outside the modal closes it without accepting.
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="sm:col-span-2 mt-6 flex items-center justify-between gap-4">

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={!boo_can_submit}
                                    className={[
                                        "rounded-xl px-6 py-2 text-sm font-semibold transition",
                                        boo_can_submit
                                            ? "bg-white/10 hover:bg-white/15 border border-white/15"
                                            : "bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed",
                                    ].join(" ")}
                                >
                                    {boo_sending ? "Sending..." : "Submit"}
                                </button>

                                {str_msg ? (
                                    <span className="text-sm text-zinc-400">
                                        {str_msg}
                                    </span>
                                ) : null}
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                            >
                                Back
                            </Link>

                        </div>
                        {/* End Submit */}
                    </form>
                </GlassPanel>



                {/* Modal Terms */}
                {boo_modal ? (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget) setModal(false);
                    }}
                  >
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/95 p-6 text-zinc-100 shadow-2xl">
                      <h2 className="text-xl font-semibold">Terms and Services</h2>

                      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                        <MDrenderer md={md_terms} />
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                          onClick={() => setModal(false)}
                        >
                          Close
                        </button>

                        <button
                          type="button"
                          className="rounded-xl border border-blue-500/60 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                          onClick={() => {
                            setTerms(true);
                            setModal(false);
                          }}
                        >
                          Accept
                        </button>
                      </div>

                    </div>
                  </div>
                ) : null}
                {/* End Modal Terms */}


            </div>
        </main>
    );
} //endfun RegisterPage
