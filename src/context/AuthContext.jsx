import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null); // ✅ exported

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // ✅ runs once on load — persists login after refresh
    const email = localStorage.getItem("currentUserEmail");
    return email ? { email } : null;
  });

  function signUp(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users)); // ✅ save user list
    localStorage.setItem("currentUserEmail", email);      // ✅ persist session
    setUser({ email });                                    // ✅ update state

    return { success: true };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUserEmail", email); // ✅ persist session
    setUser({ email });                               // ✅ update state

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("currentUserEmail"); // ✅ clear session
    setUser(null);                               // ✅ clear state
  }

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}