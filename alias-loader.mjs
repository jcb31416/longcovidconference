// alias-loader.mjs   (Node ≥ 20, compatible con la API 2024-05)
import { resolve as res } from "path";
import { pathToFileURL }  from "url";

const map = {
  "@/":                       "src/",
};

// ---------- resolve ----------------------------------------------------------
export async function resolve(specifier, context, defaultResolve) {
  for (const [alias, target] of Object.entries(map)) {
    if (specifier.startsWith(alias)) {
      const abs  = res(process.cwd(), target, specifier.slice(alias.length));
      const url  = pathToFileURL(abs).href;          // file:///…

      return { url, shortCircuit: true };            // ✅ detenemos la cadena
    }
  }
  // sin cambio → pasamos al siguiente loader / default
  return defaultResolve(specifier, context, defaultResolve);  // ✅ 3er arg
}

// ---------- load -------------------------------------------------------------
export async function load(url, context, defaultLoad) {
  return defaultLoad(url, context, defaultLoad);     // ✅ 3er arg
}
