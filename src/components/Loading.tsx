import React from "react";

const Loading: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
};

export default Loading;
