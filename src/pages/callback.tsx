import { CircularProgress } from "@mui/material";
import { authService } from "@services/auth0Service";
import { useEffect } from "react";

const CallbackPage = () => {
  useEffect(() => {
    authService.handleAuthentication();
  }, []);

  return <CircularProgress size={20} />;
};

export default CallbackPage;
