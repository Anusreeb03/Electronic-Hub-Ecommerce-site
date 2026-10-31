
function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      {message}
    </div>
  );
}

export default Toast;