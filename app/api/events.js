import { writeClient } from "../sanity/client.server";

export async function action({ request }) {
  const text = await request.text();
  let body;
  try {
    body = JSON.parse(text || "{}");
  } catch (parseErr) {
    console.error("/api/events JSON parse failed:", parseErr, "raw:", text);
    return new Response(
      JSON.stringify({ error: "Invalid JSON", details: parseErr.message }),
      { status: 400 },
    );
  }

  try {
    if (body.type === "delete") {
      if (!body.id)
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
        });
      await writeClient.delete(body.id);
      return new Response(JSON.stringify({ ok: true }));
    }

    if (body.type === "create") {
      const doc = {
        _type: "event",
        title: body.title,
        description: body.description,
        location: body.location,
        event_date: body.event_date || new Date().toISOString(),
        featured: body.featured || false,
      };
      const created = await writeClient.create(doc);
      return new Response(JSON.stringify(created));
    }

    if (body.type === "update") {
      if (!body.id)
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
        });
      const updated = await writeClient
        .patch(body.id)
        .set({
          title: body.title,
          description: body.description,
          location: body.location,
          event_date: body.event_date,
          featured: body.featured || false,
        })
        .commit();
      return new Response(JSON.stringify(updated));
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
    });
  } catch (err) {
    console.error("/api/events action error:", err);
    const message = err && err.message ? err.message : "Server error";
    const status = /Insufficient permissions|permission/.test(message)
      ? 403
      : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
