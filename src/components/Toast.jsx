import { useCart } from "../context/CartContext";

export default function ToastContainer() {
  const { toasts } = useCart();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.exiting ? "toast-exit" : ""}`}>
          <span style={{ fontSize: "1.1rem" }}>✓</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500 }}>
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}