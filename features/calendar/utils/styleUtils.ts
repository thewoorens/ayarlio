export const inputStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #e8eaf0",
  fontSize: 13,
  color: "#111827",
  outline: "none",
  fontFamily: "Arial,sans-serif",
  boxSizing: "border-box",
  ...extra,
});