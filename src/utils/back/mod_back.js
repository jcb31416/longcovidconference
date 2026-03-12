import nodemailer                           from "nodemailer";  //used by funbck_registerrequest

import clientPromise                        from "@/utils/back/mongo.server.js";
import fs                                   from "node:fs/promises";
import path                                 from "node:path";
import {  fun2_env,
          fun2_getcache,
          fun2_mongocli,
          fun2_setcache,
          fun2_rutabase}                    from "./mod_auxi.js" // jit stdalone testing











// ✅ Normalize markdown
function fun2_normalizeMd(md) {
  return md
    ?.replace(/\r\n/g, "\n")
    ?.replace(/\t/g, "  ")
    ?.trim() || null;
}//endfun fun2_normalizeMd












// export async function funbck_savewebinar(dic_in) {
//   let dic_body = JSON.parse(dic_in.body);
//
//   // ✅ minimal validation
//   if (!dic_body.slug) {
//     throw console.error("mod_back: funbck_updatedb: missing slug");
//   }
//
//   const client = await clientPromise;
//   const db = client.db( await fun2_env("MONGODB_NAME") );
//
//   dic_body        = {...dic_body,
//     md_descrip:    fun2_normalizeMd(dic_body.md_descrip ?? dic_body.md?.descrip),
//     md_sugges:     fun2_normalizeMd(dic_body.md_sugges ?? dic_body.md?.sugges),
//     createdAt:     new Date(),
//     // updatedAt:  new Date(),
//   }; //end dic_body
//
//   delete dic_body.createdAt;
//
//   // ✅ upsert by slug (insert or update)
//   const result = await db.collection("webinars").updateOne(
//     { slug: dic_body.slug },
//     { $set: dic_body,   $setOnInsert: { createdAt: new Date() } },
//     { upsert: true }
//   );
//
//   const aa = 1;
// }//endfun funbck_savewebinar





export async function funbck_getwebinar(dic_in) {

  // ver tests/data/dat_webinars.js para ver estructura devuelta
  const slug    = dic_in.slug; // caso especial, slug = "all" -> devuelve lista de docs en vez de un doc
  if (!slug)    throw new Error("Missing slug");

  const client  = await clientPromise;
  const db      = client.db( process.env.MONGODB_NAME ?? "regen" );
  let resp;


  if (slug !== "all") {
    // :dev 20260224_0002  modificado xq si lo coge de cache y es una v antigua no va a coger la nueva. para una entrada no merece la pena coger caché.
    resp = await db.collection("webinars").findOne({ slug });
    resp = resp.dc2_webinar; // en db es así
    await fun2_setcache(dic_in.slug, resp);

    // const fru     = await fun2_getcache(dic_in.slug);
    // if (fru.ok) { // coge desde cache.  [!]: cuidado. si update db esto no lo coge.
    //   resp = fru.dic_cache;
    //
    // } else { // carga desde db y salva en cache
    //   resp = await db.collection("webinars").findOne({ slug });
    //   resp = resp.dc2_webinar; // en db es así
    //   await fun2_setcache(dic_in.slug, resp);
    // }//endif fru cache


  } else { // slug all.
    // list .json with name webi_*
    const rut_base            = await fun2_rutabase();
    const rut_cache           = path.join(rut_base, "public/cache");

    // :dev 20260224 0010  omitimos paso 0 y 1, xq si no no podemos actualizar la página sin re-desplegar el proyecto.
    // // 0) lista de ficheros cache relevantes
    // let lis_filenames = [];
    // try {
    //   lis_filenames = await fs.readdir(rut_cache);
    // } catch {
    //   lis_filenames = [];
    // }
    //
    // const lis_cache_json = lis_filenames.filter(   (f) => /^(webi_|conf_)/.test(f) && f.endsWith(".json")   );
    //
    // // 1) intenta cargar cada JSON individualmente (sin tumbar todo)
    // const dic_by_slug = new Map();     // slug -> dc2_webinar (o el objeto ya normalizado)
    // const lis_missing = [];            // slugs que no estaban o fallaron
    //
    // await Promise.all(
    //   lis_cache_json.map(async (fname) => {
    //     const slug_i = fname.replace(/\.json$/, "");
    //     try {
    //       const raw = await fs.readFile(path.join(rut_cache, fname), "utf8");
    //       const obj = JSON.parse(raw);
    //       dic_by_slug.set(slug_i, obj);
    //     } catch {
    //       // si hay fichero corrupto / parse error, lo tratamos como missing
    //       lis_missing.push(slug_i);
    //     }
    //   })
    // );



    // 2) si cache está vacía o incompleta, ir a DB
    // OJO: si tu “fuente de verdad” es la DB (probable), la opción más robusta es
    // traer TODOS los slugs webi_/conf_ de DB y luego sobreescribir con cache.
    // Pero siguiendo tu intención: “solo missing”.



    // if (lis_missing.length > 0 || dic_by_slug.size === 0) {
    // Si solo quieres missing:
    // - si dic_by_slug.size === 0, no sabemos la lista completa: en ese caso conviene traer TODO de DB.
    // - si hay algunos missing, traemos solo esos slugs.
    // const query =
    //   dic_by_slug.size === 0
    //     ? { slug: /^(webi_|conf_)/ }
    //     : { slug: { $in: lis_missing } };

    const dic_by_slug = new Map;

    const lis_docs = await db
      .collection("webinars")
      .find(
        { slug: /^(webi_|conf_)/ },
        { projection: { slug: 1, dc2_webinar: 1, _id: 0 } }
      )
      .toArray();

    for (const d of lis_docs) {
      if (d?.slug && d?.dc2_webinar) {
        dic_by_slug.set(d.slug, d.dc2_webinar);
        // opcional: re-cachear missing o cache vacía
        await fun2_setcache(d.slug, d.dc2_webinar);
      }//endif
    }//endfor

    // 3) salida final como array
    resp = Array.from(dic_by_slug.values());
  } // if not slug all;  else











    // // FUNCIONAL
    // // 1) intenta cache
    // resp = [];
    // try {
    //   resp = await Promise.all(
    //     lis_webi.map(async (fname) =>
    //       JSON.parse(  await fs.readFile(path.join(rut_cache, fname)  , "utf8"))
    //     )
    //   );
    // } catch {
    //   resp = [];
    // }//endtry
    //
    // // 2) si cache vacía -> DB
    // let lis_docs;
    // if (resp.length === 0) {
    //   lis_docs = await db // webi_ webinars
    //     .collection("webinars")
    //     .find({ slug: /^webi_/ }, { projection: { slug: 1, dc2_webinar: 1, _id: 0 } })
    //     .toArray();
    //   resp = lis_docs.map((d) => d.dc2_webinar); //en db es así
    //
    //   lis_docs = await db // conf_ conferences
    //     .collection("webinars") // it's ok, it's just a bad name for the whole collection
    //     .find({ slug: /^conf_/ }, { projection: { slug: 1, dc2_webinar: 1, _id: 0 } })
    //     .toArray();
    //   lis_docs = lis_docs.map(  (d) => d.dc2_webinar  );
    //   resp = [...resp, ...lis_docs); //en db es así
    // }//endif







    // // me hubiera gustado más en flujo contínuo, ======================
    // let dic_ou,  lis_missing = [];
    // for (const str_edufile_i of lis_filenames) {
    //
    //   // 1 try cache
    //   const rut_file = path.join(rut_base,str_edufile_i);
    //   boo_cache = isfile(rut_file);
    //   if (boo_cache) {
    //     const str_raw = await fs.readFile(path.join(rut_cache, str_edufile_i);
    //     dic_ou[str_edufile_i] = JSON.parse(str_raw, "utf8");
    //
    //   } else {
    //     lis_missing.push(str_edufile_i); // anota las pendientes q no estaban en cache
    //   }//endif
    //
    // }//endfor str_edufile of lis_filenames
    //
    //
    // if (lis_missing.length>0) { // si hay pendientes, prueba en db
    //
    //   // coge todas las webi_ y conf_ que haya en db
    //   let lis_docs, lis_docs2;
    //
    //   lis_docs = await db //  extrae webi_ webinars
    //     .collection("webinars")
    //     .find({ slug: /^webi_/ }, { projection: { slug: 1, dc2_webinar: 1, _id: 0 } })
    //     .toArray();
    //   lis_docs2 = lis_docs.map((d) => d.dc2_webinar); //en db es así
    //
    //   lis_docs = await db // extrae conf_ conferences (congresos)
    //     .collection("webinars") // it's ok, it's just a bad name for the whole collection
    //     .find({ slug: /^conf_/ }, { projection: { slug: 1, dc2_webinar: 1, _id: 0 } })
    //     .toArray();
    //   lis_docs = lis_docs.map(  (d) => d.dc2_webinar  );
    //   lis_docs2 = [...lis_docs2, ...lis_docs); //en db es así
    //
    //   // excluye las que no coincida el str_edufile_i (sin el .json) con el slug
    //   for (const str_edufile_i of lis_missing) {
    //     if (any(lis_docs2).includes(str_edufile_i)) { // si uno de los missing lo ha encontrado en los resul de db,
    //       // falta hacer esta parte---
    //       ..
    //       dic_ou[str_edufile_i] = dic relacionado con str_edufile_i; // guarda el dic con estructura homóloga a los que se guardaban dentro de dic_ou de la cache
    //     }//endif db contiene el resul missing..
    //   }//endfor str_edufile_i of lis_missing
    //
    // }//if lis_missing not empty







    // if ("cache") {
    //   resp = await Promise.all(
    //     lis_webi.map(async (fname) => {
    //       const pat = path.join(rut_cache, fname);
    //       const str = await fs.readFile(pat, "utf8");
    //       return JSON.parse(str);
    //     })//endmap
    //   );//endpromise
    //
    // } else { // aquí no entra casi seguro. reads from db
    //   lis_docs = await db
    //     .collection("webinars")
    //     .find({ slug: /^webi_/ }, { projection: { slug: 1, dc2_webinar: 1, _id: 0 } }) // cuidado. cuando se hace find nulo el primer elem devuelve undefined pero no se xq
    //     .toArray();
    //   resp = lis_docs.map((d) => d.dc2_webinar); //en db es así
    // } //endif cache all

    // resp = lis_docs.map((d) => d.dc2_webinar);
  // }//endif slug all


  // optional: remove _id if you don't want to expose it
  return resp;  // list of dc2_webinar elements (slug==all)  OR  un elem dc2_webinar (slug==slug_i)
}//endfun funbck_getwebinar









export async function funbck_getdetailspeakers(dic_in) { // {lis_speakernames,  slug_webi}

  const lis_speakernames                        = JSON.parse(dic_in?.lis_speakernames) ?? null;
  if (!Array.isArray(lis_speakernames))         throw new Error("Missing lis_speakernames (array)");
  if (lis_speakernames.length === 0)            return { lis_speakernames: [], dc2_speakers: {}, missing: [] };

  let fru, dc2_speakers, dc2_webispeakers;

  // :dev 20260225_0015  hemos comentado la parte de la cache, porque al update la db, se seguía cogiendo lo que veía la caché. ===========
  // 1) intentar cache
  // fru                                           = await fun2_getcache("dc2_speakers");
  // if (fru.ok) { // intenta cache  [!] cuidado, si update db esto no lo va a detectar
  //   dc2_speakers                                = fru.dic_cache;
  //
  // } else {      // extrae de db y salva en cache
  const client                                = await clientPromise; // asumes conocido en tu repo
  const db                                    = client.db( await fun2_env("MONGODB_NAME") ); // se recomienda cambiar esa linea por hardcode:  `client.db("regen");`
  const dic_doc                               = await db.collection("webinars").findOne(
                                                  { slug:                     "speakers" },
                                                  { projection:               { _id: 0, slug: 1, dc2_speakers: 1 } }
                                              ); //end findOne

  dc2_speakers                                = dic_doc?.dc2_speakers ?? {};  // antes se cargaba de: `await fun2_setcache("dc2_speakers", dc2_speakers);`, pero se quitó xq entonces no se actualizaba cn nuevos datos en la nube

  // info: dc2_speakers tiene esta estructura,
  // export const dc2_speakers = {
  //   manuel_ruiz: {
  //     name: "Manuel Ruiz",
  //     tto: "",
  //     email: "",
  //     descrip: "Clinical and biomedical analysis laboratory technician and a fourth-year student of Biology at the Complutense University of Madrid. He is currently collaborating with CIMA of the University of Navarra in the search for biomarkers of Myalgic Encephalomyelitis/Chronic Fatigue Syndrome. His work focuses on linking Epstein-Barr virus infection in genetically predisposed patients with the development of different diseases.",
  //   },
  //   ana_aguilar: {
  //   ...

  const dc2_out                                 = {};
  // const lis_missing                             = [];
  //
  for (let int_i = 0; int_i < lis_speakernames.length; int_i += 1) {
    const key_speaker                            = lis_speakernames[int_i];
    const dic_speaker                            = dc2_speakers[key_speaker] ?? null;

    if (!dic_speaker) {
      console.log(`⚠️ funbck_getdetailspeakers: missing speaker key: ${key_speaker}`);
    }//endif

    dc2_out[key_speaker]                         = {
      name:                                     dic_speaker.name,
      tto:                                      dic_speaker.tto ?? null, // :dev 20260224_1033. mirar la misma nota yyyymmdd.. en /components/Panelistas, pues el cambio está en los dos sitios
      descrip:                                  dic_speaker.descrip ?? null,
      url:                                      dic_speaker.dic_imgmeta?.url ?? null,
      uri_vercel:                               dic_speaker.dic_imgmeta?.uri_vercel ?? null
    }; //enddic dc2_out

    // modifications por bugs de next/vercel cache image. forzamos a que coja celia_piquer3.jpg en vez de celia_piquer (contaminado por cache de vercel)
    if (key_speaker.includes("celia_piquer")) {
      debugger; // funbck_getdetailspeakers
      dc2_out.celia_piquer.url =  dc2_out.celia_piquer?.url?.replace("celia_piquer.jpg", "celia_piquer3.jpg") ?? null;
    }


  }//endfor speaker_i



  debugger;

  return dc2_out;



  //
  //   if (!dic_speaker) {
  //     lis_missing.push(key_speaker);
  //     continue;
  //   } //endif
  //
  //   // opcional: devolver solo lo necesario al frontend
  //   dc2_out[key_speaker]                         = {
  //     tto:                                       dic_speaker.tto ?? null, // :dev 20260224_1033. mirar la misma nota yyyymmdd.. en /components/Panelistas, pues el cambio está en los dos sitios
  //     descrip:                                   dic_speaker.descrip ?? null,
  //     url:                                       dic_speaker.dic_imgmeta?.url ?? null,
  //     uri_vercel:                                dic_speaker.dic_imgmeta?.uri_vercel ?? null
  //   };
  // } //endfor panelistas
  //
  // return {
  //   slug:                                        "speakers",
  //   lis_speakernames:                            lis_speakernames,
  //   dc2_speakers:                                dc2_out,
  //   missing:                                     lis_missing
  // };

} //endfun funbck_getdetailspeakers











export async function funbck_admin_refreshcache(dic_in) { //onlyadmin

  const slug = dic_in?.slug ?? null;
  if (!slug) throw new Error("Missing slug");

  // ✅ auth mínima
  if (dic_in?.admin_token !== await fun2_env("REG_ADMIN_TOKEN")) {
    throw new Error("unauthorized");
  }

  const client = await fun2_mongocli();
  const db     = client.db(await fun2_env("MONGODB_NAME"));




  // --------------------------------------------------
  // slug === "webiall"  -> refresca todos los webi_*
  // --------------------------------------------------
  if (slug === "webiall") {

    const lis_docs = await db.collection("webinars")
      .find({ slug: /^webi_/ }, { projection: { _id: 0, slug: 1, dc2_webinar: 1 } })
      .toArray();

    // write cache for each doc
    for (const d of lis_docs) {
      if (!d?.slug) continue;
      await fun2_setcache(d.slug, d.dc2_webinar ?? null);
    }

    return { ok: true, slug: "all", n: lis_docs.length };
  }//endif webiall



  // --------------------------------------------------
  // slug normal -> refresca solo uno
  // --------------------------------------------------
  if (slug.startsWith("webi_")) {
    const doc = await db.collection("webinars").findOne(
      { slug },
      { projection: { _id: 0, slug: 1, dc2_webinar: 1 } }
    );

    const dc2_webinar = doc?.dc2_webinar ?? null;
    if (!dc2_webinar) return { ok: false, err: `slug not found: ${slug}` };

    await fun2_setcache(slug, dc2_webinar);

    return { ok: true, slug };
  }//endif webi_



  if (slug === "all") {
    await funbck_admin_refreshcache({...dic_in, slug:"webiall"});
    await funbck_admin_refreshcache({...dic_in, slug:"speakers"});
  }//endif all



  if (slug === "speakers") {
    const doc = await db.collection("webinars").findOne(
      { slug },
      { projection: { _id: 0, slug: 1, dc2_speakers: 1 } }
    );

    const dc2_speakers = doc?.dc2_speakers ?? null;
    if (!dc2_speakers) return { ok: false, err: `slug not found: ${slug}` };

    await fun2_setcache("dc2_speakers", dc2_speakers);

    return { ok: true, slug };
  }//endif speakers



  // resto
  const doc = await db.collection("webinars").findOne(
    { slug },
    { projection: { _id: 0, slug: 1, [slug]: 1 } }
  );

  const fru = doc?.[slug] ?? null;
  if (!fru) return { ok: false, err: `slug not found: ${slug}` };

  await fun2_setcache(slug, fru);

  return { ok: true, slug };
}//endfun funbck_admin_refreshcache









// import fs from "node:fs/promises";
// import path from "node:path";

function fun2_maskuri(str) {
  if (!str) return null;
  // evita volcar credenciales completas al cliente
  try {

    const u = new URL(str);
    const user = u.username ? `${u.username.slice(0, 2)}***` : "";
    const host = u.host ?? "";
    const db   = u.pathname ?? "";
    return `${u.protocol}//${user}${user ? ":***@" : ""}${host}${db}`;
  } catch {
    return str.slice(0, 8) + "***";
  }
}

async function fun2_readjsonifexists(pat) {
  try {
    const str = await fs.readFile(pat, "utf8");
    return { ok: true, json: JSON.parse(str) };
  } catch (e) {
    return { ok: false, err: e?.message ?? String(e) };
  }
}

export async function funbck_test(dic_in, request) {
  const str_nodeenv     = process.env.NODE_ENV ?? null;
  const str_mongodb_name = process.env.MONGODB_NAME ?? null;

  // OJO: esto es sensible; lo devuelvo “masked” + flag de presencia
  const mongodb_uri_raw = process.env.MONGODB_URI ?? null;
  const str_mongodburi_present = Boolean(mongodb_uri_raw);
  const str_mongodburi = fun2_maskuri(mongodb_uri_raw);

  const rut_cache = path.join(process.cwd(), "public", "cache");

  const out_speakers = await fun2_readjsonifexists(path.join(rut_cache, "dc2_speakers.json"));
  const out_webinar  = await fun2_readjsonifexists(path.join(rut_cache, "webi_lc_dec2025.json"));

  const dc2_speakers = out_speakers.ok ? out_speakers.json : null;
  const dc2_webinar  = out_webinar.ok  ? out_webinar.json  : null;

  return {
    str_nodeenv,
    str_mongodb_name,
    str_mongodburi_present,
    str_mongodburi,

    rut_cache,
    cache_files: {
      "dc2_speakers.json": out_speakers.ok ? "ok" : out_speakers.err,
      "webi_lc_dec2025.json": out_webinar.ok ? "ok" : out_webinar.err,
    },

    dc2_speakers,
    dc2_webinar,
  };
}










// export const runtime = "nodejs";

export async function funbck_registerrequest(dic_in, request) {

    debugger;

    function clean(str_value) {
        return String(str_value ?? "").trim();
    } //endfun clean

    try {
        const str_name                  = clean(dic_in.name);
        const str_surname               = clean(dic_in.surname);
        const str_email                 = clean(dic_in.email);
        const str_affiliation           = clean(dic_in.affiliation);
        const str_profession            = clean(dic_in.profession);
        const str_talk_title            = clean(dic_in.talkTitle);
        const str_merits                = clean(dic_in.merits);

        if (!str_name || !str_surname || !str_email || !str_affiliation || !str_profession) {
            throw new Error("funbck_registerrequest: Missing required fields.");
        } //endif required fields

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str_email)) {
            return bad("Invalid email.");
        } //endif invalid email

        // Guardar en Mongo
        const cli_mongo                 = await clientPromise;
        const db_mongo                  = cli_mongo.db(process.env.MONGODB_NAME ?? "regen");

        const dic_doc                   = {
            name                        : str_name,
            surname                     : str_surname,
            email                       : str_email,
            affiliation                 : str_affiliation,
            profession                  : str_profession,
            talkTitle                   : str_talk_title || null,
            merits                      : str_merits,
            createdAt                   : new Date(),
            meta                        : {
                userAgent               : request.headers.get("user-agent") ?? null,
                ip                      : (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
            },
            source                      : "lcdd_register",
        };

        const dic_ins                   = await db_mongo.collection("lcdd_register").insertOne(dic_doc);

        // Email SMTP real
        const str_email_host            = clean(process.env.SMTP_HOST);
        const str_email_port            = Number(process.env.SMTP_PORT ?? 587);
        const boo_email_secure          = process.env.SMTP_SECURE === "true";
        const str_email_user            = clean(process.env.SMTP_USER);
        const str_email_pass            = clean(process.env.SMTP_PASS);
        const str_email_from            = clean(process.env.MAIL_FROM || str_email_user);
        const str_email_to              = clean(process.env.MAIL_TO || str_email_user);


        // let boo_emailsent               = false;
        let str_emailwarn               = null;
        let dic_mail_result             = null;

        if (str_email_host && str_email_user && str_email_pass) {
            try {
                const obj_transporter   = nodemailer.createTransport({
                    host                : str_email_host,
                    port                : str_email_port,
                    secure              : boo_email_secure,
                    auth                : {
                        user            : str_email_user,
                        pass            : str_email_pass,
                    },
                });

                await obj_transporter.verify();

                const str_text                      =
                    `New registration request:\n\n`                   +
                    `Name: ${str_name}\n`                             +
                    `Surname: ${str_surname}\n`                       +
                    `Email: ${str_email}\n`                           +
                    `Affiliation: ${str_affiliation}\n`               +
                    `Profession: ${str_profession}\n`                 +
                    `Merits: ${str_merits}\n`                         +
                    `Talk title: ${str_talk_title || "(empty)"}\n\n` +
                    `InsertedId: ${String(dic_ins.insertedId)}\n`;

                dic_mail_result               = await funbck_sendmail({
                    subject                         : `LCDD Registration: ${str_name} ${str_surname}`,
                    text                            : str_text,
                    replyTo                         : str_email,
                    fromName                        : "LCDD Register",
                });

            } catch (err) {
                str_emailwarn           = `Email not sent: ${String(err?.message ?? err)}`;
            } //endtry email
        } else {
            str_emailwarn               = "SMTP_HOST/SMTP_USER/SMTP_PASS not set; DB saved but email was not sent.";
        } //endif credentials

        return {
            ok                          : true,
            insertedId                  : String(dic_ins.insertedId),
            boo_emailsent               : !!(dic_mail_result?.boo_emailsent),
            str_emailwarn               : str_emailwarn?? dic_mail_result?.str_emailwarn,
        };

    } catch (err) {
        throw new Error(`funbck_registerrequest: ${err.message}`);
    } //endtry

} //endfun funbck_registerrequest








export async function funbck_sendmail(dic_in) {
    debugger;
    function clean(str_value) {
        return String(str_value ?? "").trim();
    } //endfun clean

    try {
        const str_subject               = clean(dic_in.subject);
        const str_text                  = clean(dic_in.text);
        const str_reply_to              = clean(dic_in.replyTo);
        const str_from_name             = clean(dic_in.fromName || "LCDD Register");

        const str_email_host            = clean(process.env.SMTP_HOST);
        const int_email_port            = Number(process.env.SMTP_PORT ?? 587);
        const boo_email_secure          = process.env.SMTP_SECURE === "true";
        const str_email_user            = clean(process.env.SMTP_USER);
        const str_email_pass            = clean(process.env.SMTP_PASS);
        const str_email_from            = clean(process.env.MAIL_FROM || str_email_user);
        const str_email_to              = clean(process.env.MAIL_TO || str_email_user);

        if (!str_email_host || !str_email_user || !str_email_pass) {
            return {
                ok                      : false,
                boo_emailsent           : false,
                str_emailwarn           : "SMTP_HOST/SMTP_USER/SMTP_PASS not set.",
            };
        } //endif smtp env

        if (!str_subject || !str_text) {
            throw new Error("Missing subject or text.");
        } //endif required mail fields

        const obj_transporter           = nodemailer.createTransport({
            host                        : str_email_host,
            port                        : int_email_port,
            secure                      : boo_email_secure,
            auth                        : {
                user                    : str_email_user,
                pass                    : str_email_pass,
            },
        });

        await obj_transporter.verify();

        await obj_transporter.sendMail({
            from                        : `"${str_from_name}" <${str_email_from}>`,
            to                          : str_email_to,
            replyTo                     : str_reply_to || undefined,
            subject                     : str_subject,
            text                        : str_text,
        });

        return {
            ok                          : true,
            boo_emailsent               : true,
            str_emailwarn               : null,
        };
    } catch (err) {
        throw new Error(`funbck_sendmail: ${err.message}`);
    } //endtry
} //endfun funbck_sendmail







export async function funbck_sendtocontact(dic_in, request) {
    debugger;

    function clean(str_value) {
        return String(str_value ?? "").trim();
    } //endfun clean

    try {
        const str_field                 = clean(dic_in.field);
        const str_tag                   = clean(dic_in.tag);
        const str_observations          = clean(dic_in.observations);

        if (!str_field || !str_tag || !str_observations) {
            throw new Error("funbck_sendtocontact: Missing required fields.");
        } //endif required

        const str_user_agent            = request?.headers?.get("user-agent") ?? null;
        const str_ip                    = (request?.headers?.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;

        const str_text                  =
            `New contact message:\n\n`                                  +
            `Field: ${str_field}\n`                                     +
            `Priority tag: ${str_tag}\n`                                +
            `Observations: ${str_observations}\n\n`                     +
            `Meta:\n`                                                   +
            `User-Agent: ${str_user_agent || "(empty)"}\n`              +
            `IP: ${str_ip || "(empty)"}\n`;

        const dic_mail_result           = await funbck_sendmail({
            subject                     : `LCDD Contact: ${str_field} / ${str_tag}`,
            text                        : str_text,
            replyTo                     : "",
            fromName                    : "LCDD Contact",
        });

        return {
            ok                          : true,
            boo_emailsent               : !!(dic_mail_result?.boo_emailsent),
            str_emailwarn               : dic_mail_result?.str_emailwarn ?? null,
        };
    } catch (err) {
        throw new Error(`funbck_sendtocontact: ${err.message}`);
    } //endtry
} //endfun funbck_sendtocontact
