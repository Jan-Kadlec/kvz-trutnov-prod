import { useState, useEffect } from "react";

export function SimpleCaptcha({ onVerify, resetTrigger }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Resetovat captcha když se změní resetTrigger
  useEffect(() => {
    generateCaptcha();
  }, [resetTrigger]);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setNum1(a);
    setNum2(b);
    setAnswer("");
    setVerified(false);
    setError("");
  };

  const handleVerify = () => {
    const correctAnswer = num1 + num2;
    if (parseInt(answer) === correctAnswer) {
      setVerified(true);
      setError("");
      onVerify(true);
    } else {
      setError("Špatný výsledek, zkuste znovu");
      generateCaptcha();
      onVerify(false);
    }
  };

  if (verified) {
    return (
      <div className="bg-olive-700/20 border border-olive-600 rounded p-3 text-khaki-200 text-sm">
        ✓ Captcha ověřena
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-khaki-200">
        Bezpečnostní ověření: kolik je {num1} + {num2}?
      </label>
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Zadejte výsledek"
        className="w-full px-3 py-2 bg-military-800 border border-olive-800 rounded text-khaki-100 placeholder-khaki-600 focus:border-olive-500 focus:outline-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        onClick={handleVerify}
        type="button"
        className="w-full px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
      >
        Ověřit
      </button>
    </div>
  );
}
