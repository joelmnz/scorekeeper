import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <aside className="update-prompt" role="status" aria-live="polite">
      <div>
        <strong>Update ready</strong>
        <span>Refresh when you are between scores.</span>
      </div>
      <button onClick={() => updateServiceWorker(true)}>Refresh</button>
      <button
        className="ghost"
        aria-label="Dismiss update notice"
        onClick={() => setNeedRefresh(false)}
      >
        Later
      </button>
    </aside>
  );
}
