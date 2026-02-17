import { client } from "../../sanity/client";

// GET /admin/apiEvents - returns list of events
export async function loader() {
  const data = await client.fetch(
    `*[_type == "event"] | order(event_date desc){_id, title, description, location, event_date, featured}`,
  );
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
