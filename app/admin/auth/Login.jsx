import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SimpleCaptcha } from "../security/captcha";
import { hashPassword } from "../security/hash";
import { mockAdminUser } from "../mock/adminUser";

// routes/admin/login.jsx
export async function loader() {
  // v demo verzi jen vrátíme null
  return null;
}

const LOCK_DURATION = 2 * 60 * 1000; // 2 minuty
const MAX_ATTEMPTS = 3;
const STORAGE_KEYS = {
  attempts: "kvz_login_attempts",
  lockedUntil: "kvz_login_locked_until",
};

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  // Při mountu: načíst z localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem(STORAGE_KEYS.attempts);
    const savedLockedUntil = localStorage.getItem(STORAGE_KEYS.lockedUntil);

    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10));
    }

    if (savedLockedUntil) {
      const lockedTime = new Date(savedLockedUntil);
      if (lockedTime > new Date()) {
        setLockedUntil(lockedTime);
      } else {
        // Zablokování již vypršelo
        localStorage.removeItem(STORAGE_KEYS.attempts);
        localStorage.removeItem(STORAGE_KEYS.lockedUntil);
      }
    }
  }, []);

  // Uložit attempts do localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.attempts, attempts.toString());
  }, [attempts]);

  // Uložit lockedUntil do localStorage
  useEffect(() => {
    if (lockedUntil) {
      localStorage.setItem(STORAGE_KEYS.lockedUntil, lockedUntil.toISOString());
    }
  }, [lockedUntil]);

  // Timer pro odblokování
  useEffect(() => {
    if (lockedUntil) {
      const timer = setInterval(() => {
        if (new Date() >= lockedUntil) {
          setLockedUntil(null);
          setAttempts(0);
          localStorage.removeItem(STORAGE_KEYS.attempts);
          localStorage.removeItem(STORAGE_KEYS.lockedUntil);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockedUntil]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Rate limiting
    if (lockedUntil && new Date() < lockedUntil) {
      setError(`Příliš mnoho pokusů. Zkuste za minutu.`);
      return;
    }

    if (!captchaVerified) {
      setError("Musíte nejdříve ověřit CAPTCHA");
      return;
    }

    if (!username || !password) {
      setError("Vyplňte všechna pole");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simple comparison - in production use proper bcryptjs
      if (username === mockAdminUser.username) {
        const inputHash = await hashPassword(password);
        // For demo: accept any password matching pattern
        // In production: proper bcryptjs comparison
        if (password === "admin123") {
          // Store session
          const session = {
            user: {
              id: mockAdminUser.id,
              username: mockAdminUser.username,
              email: mockAdminUser.email,
              fullName: mockAdminUser.fullName,
              role: mockAdminUser.role,
            },
            token: "demo-token-" + Date.now(),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
          };

          sessionStorage.setItem("adminSession", JSON.stringify(session));
          setAttempts(0);
          navigate("/admin/dashboard");
        } else {
          handleFailedAttempt();
        }
      } else {
        handleFailedAttempt();
      }
    } catch (err) {
      setError("Chyba při přihlašování");
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setPassword("");
    setCaptchaVerified(false);

    if (newAttempts >= MAX_ATTEMPTS) {
      const locked = new Date(Date.now() + LOCK_DURATION);
      setLockedUntil(locked);
      setError(
        "Příliš mnoho neúspěšných pokusů. Účet je zablokován na 2 minuty.",
      );
    } else {
      setError(
        `Špatné uživatelské jméno nebo heslo. Zbývá ${MAX_ATTEMPTS - newAttempts} pokusů.`,
      );
    }
  };

  const isLocked = lockedUntil && new Date() < lockedUntil;

  return (
    <div className="min-h-screen bg-military-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-military-800 border-2 border-olive-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
              KVZ ADMIN
            </h1>
            <p className="text-khaki-400 text-sm">Přihlášení administrátora</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-2">
                Uživatelské jméno
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 placeholder-khaki-600 focus:border-olive-500 focus:outline-none disabled:opacity-50"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-2">
                Heslo
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 placeholder-khaki-600 focus:border-olive-500 focus:outline-none disabled:opacity-50"
                placeholder="••••••••"
              />
              <p className="text-xs text-khaki-600 mt-1">
                Demo: heslo je "admin123"
              </p>
            </div>

            <div className="bg-military-900 border border-olive-800 rounded p-4">
              <SimpleCaptcha
                onVerify={setCaptchaVerified}
                resetTrigger={attempts}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full px-4 py-3 bg-olive-700 hover:bg-olive-600 disabled:bg-olive-900 disabled:opacity-50 text-khaki-100 font-medium rounded transition-colors"
            >
              {loading ? "Přihlašuji..." : "Přihlásit se"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-khaki-600">
            <p>Demo účet: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
