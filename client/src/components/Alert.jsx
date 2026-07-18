export function Alert({ children }) {
  if (!children) return null;

  return (
    <div className="alert" role="alert">
      {children}
    </div>
  );
}
