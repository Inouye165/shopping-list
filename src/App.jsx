

import { useState, useEffect } from 'react';
import { db } from './firebase';
import './App.css';
import { ref, onValue, push, update, remove } from 'firebase/database';


function App() {
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]); // [{id,text,addedBy,completed}]
  const [item, setItem] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [theme, setTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((login.username === "ron" || login.username === "tricia") && login.password === "dobby") {
      const u = { id: login.username, email: login.username + "@example.com" };
      setUser(u);
      try { localStorage.setItem('hl_user', JSON.stringify(u)); } catch {}
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
  setUser(null);
    setList([]);
    setLogin({ username: "", password: "" });
  try { localStorage.removeItem('hl_user'); } catch {}
  };

  const handleAddItem = () => {
    if (item.trim() && user) {
      const listRef = ref(db, 'familyShoppingList');
      const newItem = { text: item.trim(), addedBy: user.id, completed: false, createdAt: Date.now() };
      push(listRef, newItem);
      setItem("");
    }
  };

  const handleToggle = (id, current) => {
    update(ref(db, `familyShoppingList/${id}`), { completed: !current });
  };

  const handleDelete = (id) => {
    remove(ref(db, `familyShoppingList/${id}`));
  };

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const listRef = ref(db, 'familyShoppingList');
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const arr = data ? Object.entries(data).map(([id, v]) => ({ id, ...v })) : [];
      // Sort newest first by createdAt if available
      arr.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
      setList(arr);
    });
    return () => unsubscribe();
  }, []);

  // Load persisted session + theme on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hl_user');
      if (raw) setUser(JSON.parse(raw));
      const t = localStorage.getItem('hl_theme');
      if (t) setTheme(t);
    } catch {}
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light','theme-dark');
    if (theme === 'light') root.classList.add('theme-light');
    else if (theme === 'dark') root.classList.add('theme-dark');
    try { localStorage.setItem('hl_theme', theme); } catch {}
  }, [theme]);

  // Online/offline listeners
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const remaining = list.filter(i => !i.completed).length;
  const completed = list.filter(i => i.completed);
  const incomplete = list.filter(i => !i.completed);

  const clearCompleted = () => {
    completed.forEach(c => remove(ref(db, `familyShoppingList/${c.id}`)));
  };

  const cycleTheme = () => {
    setTheme(prev => prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system');
  };

  return (
    <div className="app" role="main">
      <header className="topbar">
        <h1 className="header">Home Shopping List</h1>
        <div className="meta-row">
          <div className="status-group">
            <span className="counter" aria-live="polite">{remaining} left</span>
            {!isOnline && <span className="offline" title="Offline mode">Offline</span>}
          </div>
          <button type="button" className="icon-btn theme-btn" onClick={cycleTheme} aria-label="Change theme">
            {theme === 'system' && 'Sys'}{theme === 'light' && '☀️'}{theme === 'dark' && '🌙'}
          </button>
        </div>
      </header>
      {!user ? (
        <form className="form" onSubmit={handleLogin} aria-labelledby="login-heading">
          <h2 id="login-heading" style={{margin:0,fontSize:'1rem',fontWeight:600,letterSpacing:'.5px',textTransform:'uppercase',color:'#4b5563'}}>Sign In</h2>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            className="input"
            type="text"
            value={login.username}
            onChange={e => setLogin({ ...login, username: e.target.value })}
            autoFocus
            autoComplete="username"
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            className="input"
            type="password"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
            autoComplete="current-password"
          />
          <button className="button" type="submit">Sign In</button>
          {error && <div style={{ color: "#b91c1c", marginTop: ".5em" }}>{error}</div>}
        </form>
      ) : (
        <>
          <div className="user-bar" aria-live="polite">
            <span>Signed in as <strong>{user.email}</strong></span>
            <button className="button secondary" onClick={handleLogout} type="button" aria-label="Sign out">Sign Out</button>
          </div>
          <div className="list" aria-label="Shopping list">
            <div className="row add-row" role="group" aria-label="Add item">
              <input
                className="input"
                type="text"
                value={item}
                onChange={e => setItem(e.target.value)}
                placeholder="Add item..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
              />
              <button className="button" type="button" onClick={handleAddItem} aria-label="Add item to list">Add</button>
            </div>
            {list.length === 0 ? (
              <div className="empty" aria-live="polite">No items yet. Add your first one above.</div>
            ) : (
              <>
                <ul role="list" className="group-list">
                  {incomplete.map(li => (
                    <li key={li.id} className={li.completed ? 'completed' : ''}>
                      <label className="item-main">
                        <input
                          type="checkbox"
                          checked={!!li.completed}
                          onChange={() => handleToggle(li.id, li.completed)}
                          aria-label={`Mark ${li.text} as ${li.completed ? 'not completed' : 'completed'}`}
                        />
                        <span className="item-text" title={li.text}>{li.text}</span>
                        <span className="pill-user" aria-label={`Added by ${li.addedBy}`}>{li.addedBy}</span>
                      </label>
                      <div className="item-actions">
                        <button
                          className="icon-btn"
                          type="button"
                          aria-label={`Delete ${li.text}`}
                          onClick={() => handleDelete(li.id)}
                        >&times;</button>
                      </div>
                    </li>
                  ))}
                </ul>
                {completed.length > 0 && (
                  <details className="completed-block" open>
                    <summary>{completed.length} Completed</summary>
                    <ul role="list">
                      {completed.map(li => (
                        <li key={li.id} className={li.completed ? 'completed' : ''}>
                          <label className="item-main">
                            <input
                              type="checkbox"
                              checked={!!li.completed}
                              onChange={() => handleToggle(li.id, li.completed)}
                              aria-label={`Mark ${li.text} as ${li.completed ? 'not completed' : 'completed'}`}
                            />
                            <span className="item-text" title={li.text}>{li.text}</span>
                            <span className="pill-user" aria-label={`Added by ${li.addedBy}`}>{li.addedBy}</span>
                          </label>
                          <div className="item-actions">
                            <button
                              className="icon-btn"
                              type="button"
                              aria-label={`Delete ${li.text}`}
                              onClick={() => handleDelete(li.id)}
                            >&times;</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={clearCompleted} className="button secondary small" aria-label="Clear completed items">Clear Completed</button>
                  </details>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
