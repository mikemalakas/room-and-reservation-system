// pages/UnauthorizedPage.tsx
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "10rem" }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
}
