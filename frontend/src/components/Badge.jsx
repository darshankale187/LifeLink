export default function Badge({ text, type = "" }) {
  return <span className={`badge ${type}`}>{text}</span>;
}