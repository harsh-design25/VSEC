import { useState } from 'react';
import Books from './Books.jsx';
import Members from './Members.jsx';
import Issue from './Issue.jsx';

const tabs = ['Books', 'Members', 'Issue / Return'];

export default function App() {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(null);

  const notify = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="app">
      <header>
        <h1>Library Management</h1>
        <nav>
          {tabs.map((t, i) => (
            <button key={t} className={i === tab ? 'tab active' : 'tab'} onClick={() => setTab(i)}>{t}</button>
          ))}
        </nav>
      </header>
      <main>
        {/* key forces a fresh data load when switching tabs */}
        {tab === 0 && <Books key="b" notify={notify} />}
        {tab === 1 && <Members key="m" notify={notify} />}
        {tab === 2 && <Issue key="i" notify={notify} />}
      </main>
      {toast && <div className={toast.isError ? 'toast error' : 'toast'}>{toast.msg}</div>}
    </div>
  );
}
