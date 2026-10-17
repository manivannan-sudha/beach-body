// Indian Nutrient Databank (INDB) importer.
// The dataset (Jaacks Lab, https://github.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-) is fetched
// straight from its source on the user's device and kept there; this app does not redistribute it.
(function (root) {
  "use strict";

  const SOURCE_URL = "https://raw.githubusercontent.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-/main/INDB.xlsx";
  // Dishes outside this person's diet (vegetarian plus chicken, no eggs).
  const EXCLUDE = /\b(eggs?|omelett?e|fish|prawns?|shrimps?|mutton|lamb|beef|pork|crab|lobster|meat|bacon|ham|sausages?|salami|tuna|salmon|sardines?|mackerel|anchov\w*|liver|kidney|brain|trotters|goat)\b/i;

  // ---- zip (xlsx) reading with the platform's own inflate ----
  const u16 = (b, o) => b[o] | (b[o + 1] << 8);
  const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;

  async function inflateRaw(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function unzip(buf, wanted) {
    let eocd = -1;
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
      if (u32(buf, i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("Not a zip file");
    const count = u16(buf, eocd + 10);
    let p = u32(buf, eocd + 16);
    const out = {};
    const dec = new TextDecoder();
    for (let n = 0; n < count; n++) {
      if (u32(buf, p) !== 0x02014b50) throw new Error("Bad zip directory");
      const method = u16(buf, p + 10);
      const csize = u32(buf, p + 20);
      const nameLen = u16(buf, p + 28), extraLen = u16(buf, p + 30), commentLen = u16(buf, p + 32);
      const local = u32(buf, p + 42);
      const name = dec.decode(buf.subarray(p + 46, p + 46 + nameLen));
      p += 46 + nameLen + extraLen + commentLen;
      if (!wanted.includes(name)) continue;
      const start = local + 30 + u16(buf, local + 26) + u16(buf, local + 28);
      const data = buf.subarray(start, start + csize);
      const raw = method === 0 ? data : method === 8 ? await inflateRaw(data) : null;
      if (!raw) throw new Error("Unsupported zip compression");
      out[name] = dec.decode(raw);
    }
    return out;
  }

  // ---- spreadsheet XML ----
  const unescapeXml = (s) => s.replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-f]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" }[e.toLowerCase()];
  });
  function sharedStrings(xml) {
    return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => unescapeXml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")));
  }
  function sheetRows(xml, strings) {
    const rows = [];
    for (const r of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = {};
      for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const body = c[3] || "", attrs = c[2];
        if (/t="s"/.test(attrs)) { const v = body.match(/<v>(\d+)<\/v>/); row[c[1]] = v ? strings[+v[1]] : ""; }
        else if (/t="inlineStr"/.test(attrs)) { row[c[1]] = unescapeXml([...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")); }
        else { const v = body.match(/<v>([\s\S]*?)<\/v>/); row[c[1]] = v ? v[1] : ""; }
      }
      rows.push(row);
    }
    return rows;
  }

  // ---- mapping to the app's nutrient keys ----
  const round = (n, d) => { const f = Math.pow(10, d); return Math.round(n * f) / f; };
  function toFoods(rows) {
    const head = rows[0] || {};
    const col = {};
    Object.keys(head).forEach((letter) => { col[String(head[letter]).trim()] = letter; });
    const need = ["food_code", "food_name", "energy_kcal", "protein_g", "carb_g", "fat_g"];
    need.forEach((k) => { if (!col[k]) throw new Error("Missing column " + k); });
    const get = (row, k) => { const v = parseFloat(row[col[k]]); return isFinite(v) ? v : 0; };
    const foods = [];
    let skipped = 0;
    for (const row of rows.slice(1)) {
      const name = String(row[col.food_name] || "").trim();
      const kcal = get(row, "energy_kcal");
      if (!name || !(kcal > 0) || (EXCLUDE.test(name) && !/chicken/i.test(name))) { skipped++; continue; }
      const p = get(row, "protein_g"), c = get(row, "carb_g"), f = get(row, "fat_g");
      const est = 4 * p + 4 * c + 9 * f;
      if (Math.abs(est - kcal) / Math.max(kcal, 25) > 0.35) { skipped++; continue; }
      // Deep-fried dishes in the source count all the frying oil, not what the food absorbs.
      if (kcal > 560 || f > 40) { skipped++; continue; }
      const n = [
        kcal, p, c, f, get(row, "fibre_g"), get(row, "freesugar_g"), get(row, "sfa_mg") / 1000,
        get(row, "sodium_mg"), get(row, "potassium_mg"), get(row, "calcium_mg"), get(row, "iron_mg"),
        get(row, "magnesium_mg"), get(row, "zinc_mg"), get(row, "vitc_mg"), 0, get(row, "vitd2_ug") + get(row, "vitd3_ug"),
      ].map((v) => round(v, v >= 100 ? 0 : 2));
      const unit = String(row[col.servings_unit] || "").trim();
      const servKcal = get(row, "unit_serving_energy_kcal");
      let g = servKcal > 0 ? (servKcal / kcal) * 100 : 0;
      let label = unit && /^[a-z]/i.test(unit) && !/^(ml|gm)$/i.test(unit) ? "1 " + unit : "";
      if (!(g >= 5 && g <= 900) || !label) { g = 100; label = "100 g"; }
      foods.push([String(row[col.food_code]), name, label, round(g, 0)].concat(n));
    }
    return { foods, skipped };
  }

  async function parseWorkbook(bytes) {
    const files = await unzip(bytes, ["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml"]);
    if (!files["xl/worksheets/sheet1.xml"]) throw new Error("Sheet not found");
    return toFoods(sheetRows(files["xl/worksheets/sheet1.xml"], sharedStrings(files["xl/sharedStrings.xml"] || "")));
  }

  async function download() {
    const res = await fetch(SOURCE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Download failed (" + res.status + ")");
    return parseWorkbook(new Uint8Array(await res.arrayBuffer()));
  }

  root.INDB = { SOURCE_URL, download, parseWorkbook };
})(typeof window !== "undefined" ? window : globalThis);
