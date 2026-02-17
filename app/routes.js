import { index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),

  // API routes (server handlers)
  route("api/news", "api/news.js"),
  route("api/events", "api/events.js"),
  route("api/results", "api/results.js"),

  // Admin login (no layout required)
  route("admin/login", "admin/auth/Login.jsx"),

  // Admin protected routes with layout
  route("admin", "admin/AdminWrapper.jsx", [
    route("dashboard", "admin/pages/Dashboard.jsx"),
    route("news", "admin/pages/NewsAdmin.jsx"),
    route("events", "admin/pages/EventsAdmin.jsx"),
    route("results", "admin/pages/ResultsAdmin.jsx"),
    route("gallery", "admin/pages/GalleryAdmin.jsx"),
    route("apiNews", "admin/api/news.js"),
    route("apiEvents", "admin/api/events.js"),
    route("apiGallery", "admin/api/gallery.js"),
    route("apiResults", "admin/api/results.js"),
  ]),
];
