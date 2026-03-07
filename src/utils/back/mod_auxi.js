import fs                                     from "node:fs/promises";
import path                                   from "node:path";
import { pathToFileURL }                      from "node:url";
import { MongoClient }                        from "mongodb";
import { put }                                from "@vercel/blob";











export async function fun2_rutabase(startDir = process.cwd()) {
  let dir = startDir;

  while (true) {
    const pkg = path.join(dir, "package.json");
    try {
      await fs.access(pkg);
      return dir; // ✅ basta con package.json
    } catch {}

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error("Project root not found (package.json)");
}//endfun fun2_rutabase











export async function fun2_env(str_key) {

  let resp;

  if (process.env.NODE_ENV === undefined) {

    const root                                 = await fun2_rutabase();
    const envPath                              = path.join(root, ".env.local");

    const raw                                  = (await fs.readFile(envPath, "utf8")).replace(/\r\n/g, "\n");

    const keyEsc                               = str_key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re                                   = new RegExp(`^${keyEsc}=(.*)$`, "m");
    const m                                    = raw.match(re);

    if (!m) return null;

    resp =  m[1].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

  } else { // run en api

    resp = process.env[str_key];

  } //endif run stdalone

  return resp;
} //endfun fun2_env










export async function fun2_mongocli() {

  const uri                                  = await fun2_env("MONGODB_URI");
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const client                               = new MongoClient(uri);
  await client.connect();

  return client;
} //endfun fun2_mongocli










export async function fun2_rutimages(str_dir) {

  const set_imgexts                          = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".bmp", ".tiff"]);

  const lsd_entries                          = await fs.readdir(str_dir, { withFileTypes: true });

  const lis_files                            = lsd_entries
                                                .filter(dic_e => dic_e.isFile())
                                                .map(dic_e => dic_e.name)
                                                .filter(str_name => set_imgexts.has(path.extname(str_name).toLowerCase()))
                                                .sort();

  const lsd_items                            = lis_files.map(str_filename => {
                                                const str_fullpath        = path.join(str_dir, str_filename);
                                                const str_uri             = pathToFileURL(str_fullpath).href;
                                                const str_nombre          = path.parse(str_filename).name;

                                                return { filename:        str_filename,
                                                         fullpath:        str_fullpath,
                                                         uri:             str_uri,
                                                         nombre:          str_nombre
                                                       };
                                              });

  return lsd_items;
} //endfun fun2_rutimages












export async function fun2_upblob(str_blob_prefix, pat_file) {
  const bin_buf                               = await fs.readFile(pat_file);
  const str_blob_pathname                     = `${str_blob_prefix}${  path.parse(pat_file).base  }`;

  const dic_blob                              = await put(str_blob_pathname, bin_buf, {
                                                  access:                  "public",
                                                  addRandomSuffix:         false, // no-dupli. eg, alfonso_martinez-gallarza.png
                                                  token:                   await fun2_env("BLOB_READ_WRITE_TOKEN"),
                                                  allowOverwrite:          true,
                                              }); //enddic dic_blob

  return { url: dic_blob.url,  uri_vercel: dic_blob.pathname };
} //endfun fun_upblob









export async function fun2_getcache(str_json) { // solo name sin ext, sin el .json
  // recoge dic de la cache
  const rut_base                                = await fun2_rutabase();
  const pat_cache                               = path.join(rut_base, `public/cache/${str_json}.json`);

  let resp;

  try {
    const str_cache = await fs.readFile(pat_cache, "utf8");
    const dic_cache = JSON.parse(str_cache);
    resp = {ok: true, dic_cache: dic_cache};
  } catch {
    resp = {ok: false, err: `public/cache/${str_json} failed`};
  }//endtry

  return resp;
}//endfun fun2_getcache










export async function fun2_setcache(str_json, dic_cache) { // solo name sin ext, sin el .json
  // guarda dic en la cache

  const rut_base  = await fun2_rutabase();
  const pat_cache = path.join(rut_base, `public/cache/${str_json}.json`);

  let resp;

  try {
    await fs.mkdir(path.dirname(pat_cache), { recursive: true });

    const str_out = JSON.stringify(dic_cache, null, 2);
    await fs.writeFile(pat_cache, str_out, "utf8");

    resp = { ok: true, pat_cache };
  } catch (err) {
    resp = { ok: false, err: `${pat_cache} write failed: ${err?.message ?? err}` };
  }

  return resp;
}//endfun fun2_setcache
