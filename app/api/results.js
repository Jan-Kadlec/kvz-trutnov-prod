import { writeClient } from "../sanity/client.server";
import { Buffer } from "buffer";

// Helper to upload a base64-encoded file object: { name, type, content }
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
    console.error("/api/results JSON parse failed:", parseErr, "raw:", text);
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
      // upload files (if any) and create references
      const propositionRef = await uploadFileObj(body.proposition_pdf);
      const resultsRef = await uploadFileObj(body.results_pdf);
      const photosRef = await uploadFileObj(body.photos, "image");

      const doc = {
        _type: "result",
        event_name: body.event_name,
        location: body.location,
        event_date: body.event_date,
      };

      if (propositionRef) doc.proposition_pdf_url = propositionRef;
      if (resultsRef) doc.results_pdf_url = resultsRef;
      if (photosRef) doc.photos_url = photosRef;

      const created = await writeClient.create(doc);
      return new Response(JSON.stringify(created));
    }

    if (body.type === "update") {
      if (!body.id)
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
        });

      // upload files (if any) and collect patch data
      const patchData = {
        event_name: body.event_name,
        location: body.location,
        event_date: body.event_date,
      };

      const propositionRef = await uploadFileObj(body.proposition_pdf);
      const resultsRef = await uploadFileObj(body.results_pdf);
      const photosRef = await uploadFileObj(body.photos, "image");

      if (propositionRef) patchData.proposition_pdf_url = propositionRef;
      if (resultsRef) patchData.results_pdf_url = resultsRef;
      if (photosRef) patchData.photos_url = photosRef;

      const updated = await writeClient.patch(body.id).set(patchData).commit();
      return new Response(JSON.stringify(updated));
    }

    // Delete a single asset reference (and optionally delete the asset document)
    if (body.type === "deleteAsset") {
      if (!body.id || !body.field)
        return new Response(JSON.stringify({ error: "Missing id or field" }), {
          status: 400,
        });

      const allowed = ["proposition_pdf_url", "results_pdf_url", "photos_url"];
      if (!allowed.includes(body.field))
        return new Response(JSON.stringify({ error: "Invalid field" }), {
          status: 400,
        });

      // Unset the field on the document
      await writeClient.patch(body.id).unset([body.field]).commit();

      // Optionally delete the asset document by its id (e.g., "file-..." or "image-...")
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
    console.error("/api/results action error:", err);
    const message = err && err.message ? err.message : "Server error";
    const status = /Insufficient permissions|permission/.test(message)
      ? 403
      : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
