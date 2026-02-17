import { client } from "../../sanity/client";

export async function loader() {
  const data = await client.fetch(`
    *[_type == "result"] | order(event_date desc){
      _id,
      event_name,
      location,
      event_date,
      proposition_pdf_url{
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      results_pdf_url{
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      photos_url{
        asset->{
          _id,
          url,
          originalFilename
        }
      }
    }
  `);

  console.dir(data[0]);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
