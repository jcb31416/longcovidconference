import { motion }             from 'framer-motion';
import clsx                   from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import Link                   from 'next/link';
import MDrenderer             from '@/components/MDrenderer.jsx';
import Panelistas             from "@/components/Panelistas.jsx";

export default function Panel({ dic_webinar, str_viewmode: str_viewmode_prop }) {

  const str_tit               = dic_webinar.title; // se transfiere de cómo estan dirmt escritas en la db
  const str_subtit            = dic_webinar.subtitle;
  const str_date              = dic_webinar.startsAt;        // ISO string
  const str_panelstate0       = dic_webinar.panelState; // x si falla la fecha. tiene este xdef.
  const href_access           = dic_webinar.dic_urls.about;
  const url_yt                = dic_webinar.dic_urls.yt;
  const url_room              = dic_webinar.dic_urls.event;
  const url_emergency_room    = dic_webinar.dic_urls.emergencyRoom;
  const url_contact_panelist  = dic_webinar.dic_urls.contactPanelist;

  const {delay, md_descrip, md_sugges, lis_speakernames, str_viewmode} = dic_webinar;

  const boo_conf  = href_access.includes("conf_");

  const str_panelstate = useMemo(() => {  // "pre"|"active"|"done"

    if (!str_date) return str_panelstate0;

    const tEvent = new Date(str_date).getTime();
    if (Number.isNaN(tEvent)) return str_panelstate;

    const now     = Date.now();
    const week    = 7 * 24 * 3600 * 1000;
    const day     = 24 * 3600 * 1000;

    if (boo_conf) { // conference (congreso)
      if (now < tEvent - 3*week) return "pre";
      if (now <= tEvent + day)   return "active";
    } else { // webinar
      if (now < tEvent - week) return "pre";
      if (now <= tEvent + day) return "active";
    }//endif

    return "done";
  }, [str_date, str_panelstate0]);



  const isPreview = str_viewmode_prop === "vprevia";
  const isFull    = !isPreview;

  const isPre     = str_panelstate === "pre";
  const isActive  = str_panelstate === "active";
  const isDone    = str_panelstate === "done";

  const [boo_copied,  set_copied]  = useState(false);
  const [str_countdw, set_countdw] = useState('');

  const handleCopy = async () => {
    if (!url_room) return;
    await navigator.clipboard.writeText(url_room);
    set_copied(true);
    setTimeout(() => set_copied(false), 1500);
  };

  const str_basebutton =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none';

  const btnPrimary = [
    'bg-blue-600 text-white',
    'hover:bg-blue-700',
    'focus-visible:ring-2 focus-visible:ring-blue-500/50',
  ];

  const btnSecondary = [
    'border border-zinc-900/20 dark:border-zinc-50/20',
    'text-zinc-700 dark:text-zinc-200',
    'hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5',
  ];

  const btnGreen = [
    'bg-emerald-600 text-white',
    'hover:bg-emerald-700',
    'focus-visible:ring-2 focus-visible:ring-emerald-500/50',
  ];

  const btnOrange = [
    'bg-orange-600 text-white',
    'hover:bg-orange-700',
    'focus-visible:ring-2 focus-visible:ring-orange-500/50',
  ];



  // ✅ str_countdw solo si: full + (pre/active)
  useEffect(() => {
    if (!isFull) return;
    if (isDone) return;

    const target = new Date(str_date);

    const tick = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        set_countdw(`El ${boo_conf? "congreso": "webinar"} ha comenzado`);
        return;
      }

      const totalSeconds  = Math.floor(diff / 1000);
      const days          = Math.floor(totalSeconds / 86400);
      const hours         = Math.floor((totalSeconds % 86400) / 3600);
      const minutes       = Math.floor((totalSeconds % 3600) / 60);
      const seconds       = totalSeconds % 60;

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours.toString().padStart(2, '0')}h`);
      parts.push(`${minutes.toString().padStart(2, '0')}m`);
      parts.push(`${seconds.toString().padStart(2, '0')}s`);

      set_countdw(parts.join(' '));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isFull, isDone]);



  const str_formateddate = useMemo(() => {
    if (!str_date) return null;
    const d = new Date(str_date);
    if (isNaN(d)) return null;

    const aa = d.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid',
    });

    // console.log(`com_panel: str_formateddate: ${aa}`);

    return aa;
  }, [str_date]);



  const url_yt_emb = useMemo(() => {
    if (!url_yt) return null;

    try {
      const u = new URL(url_yt);
      if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) return url_yt;

      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;

      if (u.hostname === 'youtu.be' && u.pathname.length > 1) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      }
      return url_yt;
    } catch {
      return url_yt;
    }
  }, [url_yt]);




  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className={clsx(
        'flex flex-col gap-4 rounded-2xl p-6 md:p-8 backdrop-blur-md',
        'bg-zinc-0/70 dark:bg-zinc-900/70',
        'border border-zinc-900/15 dark:border-zinc-50/15',
        'hover:border-zinc-900/80 dark:hover:border-zinc-50/80',
        'transition-all duration-300'
      )}
    >


      {/* Header (siempre) */}
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold italic text-secondary-500">{str_tit}</h2>
        <p className="text-sm tracking-wide text-zinc-500 dark:text-zinc-400">{str_subtit}</p>
        {str_formateddate && (
          <p className="text-sm tracking-wide text-zinc-500 dark:text-zinc-400">{str_formateddate}</p>
        )}

        {/* countdown solo full y no done */}
        {isFull && !isDone && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
              Empieza en:
            </span>
            <span className="text-sm font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
              {str_countdw}
            </span>
          </div>
        )}
      </header>



      {/* ✅ Vista previa: solo botón de acceder + (opcional) un mini texto */}
      {isPreview && (
        <div className="mt-2 flex flex-wrap gap-3">
          {href_access ? (
            <Link href={href_access} className={clsx(str_basebutton, btnPrimary)}>
              Acceder
            </Link>
          ) : (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              (Falta href_access)
            </span>
          )}
        </div>
      )}









      {/* ✅ FULL mode */}
      {isFull && (
        <>


          {/* Zona intermedia: active -> instrucciones, done -> youtube */}
          {(isActive || isDone) && (
            <div
              className={clsx(
                'mt-2 rounded-xl px-4 py-3 text-sm leading-relaxed',
                'bg-zinc-50/70 text-zinc-700 border border-zinc-900/10',
                'dark:bg-zinc-950/30 dark:text-zinc-200 dark:border-zinc-50/10'
              )}
            >
              {isActive && (
                <div className="mt-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  <MDrenderer md={md_sugges}/>
                </div>)}

              {isDone && url_yt_emb && false && ( // <---------[!]: se ha metido un "false" a pelo para inhibir render video
                // ✅ limitamos ancho "tablet"
                <div className="w-full max-w-3xl mx-auto">
                  <div
                    className="relative w-full overflow-hidden rounded-lg"
                    style={{ paddingTop: '56.25%' }}
                  >
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={url_yt_emb}
                      title={boo_conf? "conference": "webinar"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}


          {/* Description (siempre en full) */}
          {(isActive || isDone) && md_descrip && (
            <div className="mt-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              <MDrenderer md={md_descrip}/>
            </div>
          )}

          {/* Botones PRE */}
          {isPre && (
            <div className="mt-2 flex flex-wrap gap-3">
              {url_contact_panelist && (
                <a
                  href={url_contact_panelist}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(str_basebutton, btnGreen)}
                >
                  Quiero ser panelista
                </a>
              )}

              {/* Volver a dashboard edu */}
              <Link href={"/edu"} className={clsx(str_basebutton, btnSecondary)}>
                Volver
              </Link>
            </div>
          )}


          {/* Botones ACTIVE */}
          {isActive && (
            <>
              <div className="mt-2 flex flex-wrap gap-3">

                {url_room && (
                  <a
                    href={url_room}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(str_basebutton, btnPrimary)}
                  >
                    Ir a zoom session
                  </a>
                )}

                {url_room && (
                  <button type="button" onClick={handleCopy} className={clsx(str_basebutton, btnSecondary)}>
                    {boo_copied ? 'Copiado ✓' : 'Copiar link'}
                  </button>
                )}

                {/* Volver a dashboard edu */}
                <Link href={"/edu"} className={clsx(str_basebutton, btnSecondary)}>
                  Volver
                </Link>

              </div>

              {url_emergency_room && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  Sala preliminar (panelistas) 10 minutos antes, para incidencias técnicas.
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-3">
                {url_emergency_room && (
                  <a
                    href={url_emergency_room}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(str_basebutton, btnOrange)}
                  >
                    Sala preliminar
                  </a>
                )}
              </div>

            </>
          )}
          {/*end botones active*/}

          {/* Botones DONE */}
          {isDone && (
            <div className="mt-2 flex flex-wrap gap-3">

              {/* Volver a dashboard edu */}
              <Link href={"/edu"} className={clsx(str_basebutton, btnSecondary)}>
                Volver
              </Link>
            </div>
          )}


          {/* DONE sin youtube: si quieres un fallback */}
          {isDone && !url_yt_emb && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Grabación no disponible.
            </p>
          )}



          {/* panel de speakers */}
          {(isActive || isDone) && (
              <div className="mt-4">
                <Panelistas lis_speakernames={lis_speakernames}/>
              </div>
            )
          } {/* end speakers */}

        </>
      )}   {/*end full mode*/}
    </motion.article>
  );
}
