import { RequireAuth } from "./auth/RequireAuth";
import { AdminLayout } from "./layout/AdminLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewsAdmin } from "./pages/NewsAdmin";
import { EventsAdmin } from "./pages/EventsAdmin";
import { ResultsAdmin } from "./pages/ResultsAdmin";
import { GalleryAdmin } from "./pages/GalleryAdmin";
import { Login } from "./auth/Login";

export const adminRoutes = [
  {
    path: "admin",
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </RequireAuth>
        ),
      },
      {
        path: "news",
        element: (
          <RequireAuth>
            <AdminLayout>
              <NewsAdmin />
            </AdminLayout>
          </RequireAuth>
        ),
      },
      {
        path: "events",
        element: (
          <RequireAuth>
            <AdminLayout>
              <EventsAdmin />
            </AdminLayout>
          </RequireAuth>
        ),
      },
      {
        path: "results",
        element: (
          <RequireAuth>
            <AdminLayout>
              <ResultsAdmin />
            </AdminLayout>
          </RequireAuth>
        ),
      },
      {
        path: "gallery",
        element: (
          <RequireAuth>
            <AdminLayout>
              <GalleryAdmin />
            </AdminLayout>
          </RequireAuth>
        ),
      },
    ],
  },
];
