import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function RequireAuth({ children }) {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem("adminSession");
    if (!session) {
      navigate("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(session);
      const expiresAt = new Date(parsed.expiresAt);
      if (new Date() > expiresAt) {
        sessionStorage.removeItem("adminSession");
        navigate("/admin/login");
        return;
      }
      setReady(true);
    } catch {
      sessionStorage.removeItem("adminSession");
      navigate("/admin/login");
    }
  }, [navigate]);

  if (!ready) return null;
  return <>{children}</>;
}
