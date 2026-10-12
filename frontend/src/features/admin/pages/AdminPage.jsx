import { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";
const emptyForm = { name: "", price: "", category: "" };

const getApiError = async (response, fallbackMessage) => {
  const body = await response.text();
  if (!body) return fallbackMessage;

  try {
    const details = JSON.parse(body);
    if (typeof details === "string") return details;
    if (details.title) return details.title;
    if (details.detail) return details.detail;
    if (details.errors) {
      return Object.values(details.errors).flat().join(" ");
    }
  } catch {
    return body;
  }

  return fallbackMessage;
};

const AdminPage = () => {
  const [token, setToken] = useState(() => localStorage.getItem("campuseats_admin_token"));
  const [isSignUp, setIsSignUp] = useState(false);
  const [account, setAccount] = useState({ name: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Invalid email or password." : "Unable to sign in.");
      }

      const data = await response.json();
      localStorage.setItem("campuseats_admin_token", data.token);
      setToken(data.token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error(await getApiError(response, "Unable to create account."));
      }

      setIsSignUp(false);
      setLogin({ email: account.email, password: account.password });
      setAccount({ name: "", email: "", password: "" });
      setMessage("Account created. Sign in to continue.");
    } catch (requestError) {
      setError(typeof requestError.message === "string" ? requestError.message : "Unable to create account.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          category: form.category.trim(),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("campuseats_admin_token");
        setToken(null);
        throw new Error("Your account does not have admin access.");
      }

      if (!response.ok) {
        const details = await response.json().catch(() => null);
        throw new Error(details?.title || "Unable to add this eat.");
      }

      setForm(emptyForm);
      setMessage("Eat added successfully. Return to the menu to see it.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("campuseats_admin_token");
    setToken(null);
  };

  if (!token) {
    return (
      <div className="admin-page">
        <div className="order-form admin-card">
          <p className="eyebrow">Staff access</p>
          <h1>{isSignUp ? "Create an account" : "Sign in to manage the menu"}</h1>
          <p className="form-note">{isSignUp ? "Create an account, then ask an administrator to grant menu access." : "Use an account with the Admin role."}</p>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} noValidate>
            {isSignUp && (
              <label>
                Full name
                <input
                  value={account.name}
                  onChange={(event) => setAccount({ ...account, name: event.target.value })}
                  required
                  minLength="2"
                  maxLength="80"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                value={isSignUp ? account.email : login.email}
                onChange={(event) => isSignUp
                  ? setAccount({ ...account, email: event.target.value })
                  : setLogin({ ...login, email: event.target.value })}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={isSignUp ? account.password : login.password}
                onChange={(event) => isSignUp
                  ? setAccount({ ...account, password: event.target.value })
                  : setLogin({ ...login, password: event.target.value })}
                required
                minLength="8"
              />
            </label>
            {error && <p className="field-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}
            <button className="button submit-button" type="submit">{isSignUp ? "Create account" : "Sign in"} <span>↗</span></button>
          </form>
          <button className="back-link admin-logout" type="button" onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setMessage("");
          }}>
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="order-form admin-card">
        <div className="form-heading">
          <span className="form-step">01</span>
          <div>
            <p className="eyebrow">Staff access</p>
            <h1>Add an eat</h1>
          </div>
        </div>
        <p>Add a new item to the campus menu for students to discover.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Eat name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Vegetable Kottu"
              maxLength="80"
              required
            />
          </label>
          <label>
            Price (Rs.)
            <input
              type="number"
              min="0"
              max="100000"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="750"
              required
            />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              placeholder="Mains"
              maxLength="40"
              required
            />
          </label>
          {error && <p className="field-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <button className="button submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add eat"} <span>↗</span>
          </button>
        </form>
        <button className="back-link admin-logout" type="button" onClick={logout}>Sign out</button>
      </div>
    </div>
  );
};

export default AdminPage;
