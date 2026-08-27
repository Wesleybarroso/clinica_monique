import { ENV } from "./_core/env";

const clinicCenter = "-23.547313,-46.570779";

export async function getClinicStaticMap(): Promise<string> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    throw new Error("Google Maps Static Maps configuration is missing");
  }

  const url = new URL(`${ENV.forgeApiUrl.replace(/\/+$/, "")}/v1/maps/proxy/maps/api/staticmap`);
  url.searchParams.set("key", ENV.forgeApiKey);
  url.searchParams.set("center", clinicCenter);
  url.searchParams.set("zoom", "16");
  url.searchParams.set("size", "640x420");
  url.searchParams.set("scale", "2");
  url.searchParams.set("maptype", "roadmap");
  url.searchParams.set("markers", `color:0xC8A34A|label:M|${clinicCenter}`);

  const response = await fetch(url, { headers: { Accept: "image/png,image/*" } });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[Google Maps] Static map request failed", response.status, detail.slice(0, 240));
    throw new Error("Google Maps Static Maps request failed");
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] || "image/png";
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}
