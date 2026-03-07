"use client";

import MDrenderer                       from "@/components/MDrenderer.jsx";

function fun_get_item_cn(str_type) {
    if (str_type === "opening") {
        return "border-l-blue-400/70";
    } //endif

    if (str_type === "discussion") {
        return "border-l-amber-400/70";
    } //endif

    if (str_type === "closing") {
        return "border-l-fuchsia-400/70";
    } //endif

    return "border-l-white/15";
} //endfun fun_get_item_cn

function fun_get_badge(str_type) {
    if (str_type === "opening") {
        return "Opening";
    } //endif

    if (str_type === "discussion") {
        return "Discussion";
    } //endif

    if (str_type === "closing") {
        return "Closing";
    } //endif

    return null;
} //endfun fun_get_badge

function ProgramItem({ dic_item }) {
    const str_badge                     = fun_get_badge(dic_item.str_type);
    const str_item_cn                   = fun_get_item_cn(dic_item.str_type);

    return (
        <article className={`grid grid-cols-1 gap-3 border-l-2 pl-4 md:grid-cols-[132px_minmax(0,1fr)] md:gap-6 ${str_item_cn}`}>
            {/* Time */}
            <div className="md:pt-1">
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-300">
                    {dic_item.time}
                </div>
            </div>
            {/* End Time */}

            {/* Content */}
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold leading-snug text-zinc-100">
                        {dic_item.title}
                    </h4>

                    {str_badge ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            {str_badge}
                        </span>
                    ) : null}
                </div>

                {dic_item.description ? (
                    <div className="mt-2 text-sm leading-7 text-zinc-300">
                        {dic_item.description}
                    </div>
                ) : null}
            </div>
            {/* End Content */}
        </article>
    );
} //endfun ProgramItem

function ProgramBlock({ dic_block, int_index }) {
    return (
        <section className="rounded-2xl border border-white/10 bg-black/20 px-5 py-5 md:px-6 md:py-6">
            {/* Block header */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Block {int_index + 1}
                </div>

                <h3 className="text-lg font-semibold italic text-zinc-100">
                    {dic_block.title}
                </h3>
            </div>
            {/* End Block header */}

            {dic_block.subtitle ? (
                <>
                    {/* Block subtitle */}
                    <div className="mb-5 text-sm italic text-zinc-400">
                        {dic_block.subtitle}
                    </div>
                    {/* End Block subtitle */}
                </>
            ) : null}

            {/* Block items */}
            <div className="space-y-6">
                {dic_block.lis_items.map((dic_item, idx) => (
                    <ProgramItem
                        key={`${dic_block.title}_${dic_item.time}_${idx}`}
                        dic_item={dic_item}
                    />
                ))}
            </div>
            {/* End Block items */}
        </section>
    );
} //endfun ProgramBlock

export default function ConferenceProgram({ dic_program }) {
    if (!dic_program) {
        return null;
    } //endif

    const lis_blocks_main               = Array.isArray(dic_program.lis_blocks) ? dic_program.lis_blocks : [];

    const dic_intro_block               = lis_blocks_main[0]?.title === "Programa"
        ? lis_blocks_main[0]
        : null;

    const lis_blocks                    = dic_intro_block ? lis_blocks_main.slice(1) : lis_blocks_main;

    return (
        <div className="space-y-8">
            {/* Timezone note */}
            {dic_program.timezone_note ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs italic text-zinc-400">
                    {dic_program.timezone_note}
                </div>
            ) : null}
            {/* End Timezone note */}

            {/* Intro items */}
            {dic_intro_block?.lis_items?.length ? (
                <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Opening
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-5 md:px-6 md:py-6">
                        <div className="space-y-6">
                            {dic_intro_block.lis_items.map((dic_item, idx) => (
                                <ProgramItem
                                    key={`intro_${dic_item.time}_${idx}`}
                                    dic_item={dic_item}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
            {/* End Intro items */}

            {/* Main blocks */}
            <div className="space-y-6">
                {lis_blocks.map((dic_block, idx) => (
                    <ProgramBlock
                        key={`${dic_block.title}_${idx}`}
                        dic_block={dic_block}
                        int_index={idx}
                    />
                ))}
            </div>
            {/* End Main blocks */}

            {/* Structure */}
            {dic_program.structure_md ? (
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 md:px-6 md:py-6">
                    {/* Structure header */}
                    <h3 className="text-lg font-semibold italic text-zinc-100">
                        Structure
                    </h3>
                    {/* End Structure header */}

                    {/* Structure body */}
                    <div className="mt-4 text-sm leading-7 text-zinc-300">
                        <MDrenderer md={dic_program.structure_md} />
                    </div>
                    {/* End Structure body */}
                </section>
            ) : null}
            {/* End Structure */}
        </div>
    );
} //endfun ConferenceProgram
