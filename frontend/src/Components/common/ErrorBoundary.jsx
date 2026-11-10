import React from "react";

/** Последна защита при грешка по време на рендериране — показва страница вместо бял екран. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="notfound" role="alert">
        <div>
          <h1>Нещо се обърка</h1>
          <p>Страницата не успя да се зареди. Презаредете я — ако проблемът остане, върнете се към началната страница.</p>
          <div className="notfound__actions">
            <button className="MuiButtonBase-root" onClick={() => window.location.reload()} style={btn(true)}>
              Презареди страницата
            </button>
            <a href="/" style={btn(false)}>Към началната страница</a>
          </div>
        </div>
      </main>
    );
  }
}

const btn = (primary) => ({
  border: primary ? 0 : "1px solid var(--line)",
  borderRadius: 10,
  padding: "12px 20px",
  fontWeight: 600,
  cursor: "pointer",
  color: primary ? "#fff" : "var(--ink)",
  background: primary ? "var(--petrol)" : "var(--surface)",
});

export default ErrorBoundary;
