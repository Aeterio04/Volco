import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NGORegister() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to register page with NGO tab active
    navigate("/register?tab=ngo", { replace: true });
  }, [navigate]);

  // This component redirects immediately, so we don't need to render anything
  return null;
}
