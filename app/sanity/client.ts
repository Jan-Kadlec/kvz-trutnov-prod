import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "1jy54ius",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
