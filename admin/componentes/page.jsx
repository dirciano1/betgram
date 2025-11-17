export default function Sidebar() {
  return (
    <div style={{
      width: 230,
      background: "#0f172a",
      minHeight: "100vh",
      padding: "20px 10px",
      color: "#fff"
    }}>
      <h2 style={{ color: "#22c55e", marginBottom: 20 }}>Betgram Admin</h2>

      <a href="/admin">Dashboard</a><br />
      <a href="/admin/usuarios">Usuários</a><br />
      <a href="/admin/analises">Análises</a><br />
    </div>
  );
}
