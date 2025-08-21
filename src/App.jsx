
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set, push } from 'firebase/database';

function App() {
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  const [item, setItem] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if ((login.username === "ron" || login.username === "tricia") && login.password === "dobby") {
      setUser({ id: login.username, email: login.username + "@example.com" });
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setList([]);
    setLogin({ username: "", password: "" });
  };

  const handleAddItem = () => {
    if (item.trim() && user) {
      const listRef = ref(db, 'familyShoppingList');
      const newItem = { text: item, addedBy: user.id };
      push(listRef, newItem);
      setItem("");
    }
  };

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const listRef = ref(db, 'familyShoppingList');
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const arr = data ? Object.values(data) : [];
      setList(arr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>Home Shopping List</h1>
      {!user ? (
        <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: "2em auto" }}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={login.username}
              onChange={e => setLogin({ ...login, username: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={login.password}
              onChange={e => setLogin({ ...login, password: e.target.value })}
            />
          </div>
          <button type="submit">Sign In</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      ) : (
        <>
          <div>
            <span>Signed in as {user.email}</span>
            <button onClick={handleLogout} style={{ marginLeft: '1em' }}>Sign Out</button>
          </div>
          <div className="list-section">
            <input
              type="text"
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="Add item..."
            />
            <button onClick={handleAddItem}>Add</button>
            <ul>
              {list.map((li, idx) => (
                <li key={idx}>
                  {li.text} <span style={{color: '#888', fontSize: '0.9em'}}>({li.addedBy})</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
