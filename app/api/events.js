import { writeClient } from "../sanity/client.server";
import { Buffer } from "buffer";

// helper same as in results.js
async function uploadFileObj(fileObj, kind = "file") {
  if (!fileObj || !fileObj.content) return null;
  const buffer = Buffer.from(fileObj.content, "base64");
  const asset = await writeClient.assets.upload(kind, buffer, {
    filename: fileObj.name,
    contentType: fileObj.type,
  });
  return {
    _type: kind === "image" ? "image" : "file",
    asset: { _type: "reference", _ref: asset._id },
  };
}

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
      // handle file upload
      const propositionRef = await uploadFileObj(body.proposition);
      const doc = {
        _type: "event",
        title: body.title,
        description: body.description,
        location: body.location,
        event_date: body.event_date || new Date().toISOString(),
        featured: body.featured || false,
      };
      if (propositionRef) doc.proposition = propositionRef;
      const created = await writeClient.create(doc);
      return new Response(JSON.stringify(created));
    }

    if (body.type === "update") {
      if (!body.id)
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
        });
      // prepare patch data
      const patchData = {
        title: body.title,
        description: body.description,
        location: body.location,
        event_date: body.event_date,
        featured: body.featured || false,
      };
      const propositionRef = await uploadFileObj(body.proposition);
      if (propositionRef) patchData.proposition = propositionRef;
      const updated = await writeClient
        .patch(body.id)
        .set(patchData)
        .commit();
      return new Response(JSON.stringify(updated));
    }

    // allow removing a previously attached file
    if (body.type === "deleteAsset") {
      if (!body.id || !body.field)
        return new Response(JSON.stringify({ error: "Missing id or field" }), {
          status: 400,
        });
      const allowed = ["proposition"];
      if (!allowed.includes(body.field))
        return new Response(JSON.stringify({ error: "Invalid field" }), {
          status: 400,
        });
      await writeClient.patch(body.id).unset([body.field]).commit();
      if (body.assetId && body.deleteAsset) {
        try {
          await writeClient.delete(body.assetId);
        } catch (e) {
          console.warn("Failed to delete asset:", body.assetId, e);
        }
      }
      return new Response(JSON.stringify({ ok: true }));
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
