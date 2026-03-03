import { client } from "../../sanity/client";

// GET /admin/apiUsers?username=foo
export async function loader({ request }) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return new Response(JSON.stringify({ error: "missing username" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await client.fetch(
    `*[_type == "user" && username == $username][0]{_id, username, password}`,
    { username },
  );

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
