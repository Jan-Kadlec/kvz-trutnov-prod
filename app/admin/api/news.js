import { client } from "../../sanity/client";

// GET /admin/apiNews - returns list of news documents
export async function loader() {
  const data = await client.fetch(
    `*[_type == "news"] | order(published_at desc){_id, title, slug, published_at, excerpt, content, "image": image.asset->url}`,
  );
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
