import { client } from "../../sanity/client";

export async function loader() {
  const data = await client.fetch(
    `*[_type == "gallery"] | order(date desc){_id, title, date, "images": images[]{asset->{url}, alt}}`,
  );
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
