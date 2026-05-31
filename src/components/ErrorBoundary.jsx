import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo: errorInfo || null,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: "#111",
            color: "white",
            padding: "30px",
            overflow: "auto",
            fontFamily: "monospace",
          }}
        >
          <h2>App Crashed</h2>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.toString()}
          </pre>

          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>
            {this.state.errorInfo?.componentStack || "No component stack available"}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;