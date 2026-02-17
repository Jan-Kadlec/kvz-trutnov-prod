import { writeClient } from "../sanity/client.server";
import { Buffer } from "buffer";

// Helper to upload a base64-encoded image object: { name, type, content }
async function uploadImageObj(imageObj) {
  if (!imageObj || !imageObj.content) return null;
  const buffer = Buffer.from(imageObj.content, "base64");
  const asset = await writeClient.assets.upload("image", buffer, {
    filename: imageObj.name,
    contentType: imageObj.type,
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

export async function action({ request }) {
  const text = await request.text();
  let body;
  try {
    body = JSON.parse(text || "{}");
  } catch (parseErr) {
    console.error("/api/news JSON parse failed:", parseErr, "raw:", text);
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
      const imageRef = await uploadImageObj(body.image);

      const doc = {
        _type: "news",
        title: body.title,
        published_at: body.published_at || new Date().toISOString(),
        excerpt: body.excerpt || "",
        content: body.content || "",
      };

      if (imageRef) doc.image = imageRef;

      const created = await writeClient.create(doc);
      return new Response(JSON.stringify(created));
    }

    if (body.type === "update") {
      if (!body.id)
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
        });

      const patchData = {
        title: body.title,
        published_at: body.published_at,
        excerpt: body.excerpt || "",
        content: body.content || "",
      };

      const imageRef = await uploadImageObj(body.image);
      if (imageRef) patchData.image = imageRef;

      const updated = await writeClient.patch(body.id).set(patchData).commit();
      return new Response(JSON.stringify(updated));
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
    });
  } catch (err) {
    console.error("/api/news action error:", err);
    const message = err && err.message ? err.message : "Server error";
    const status = /Insufficient permissions|permission/.test(message)
      ? 403
      : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
