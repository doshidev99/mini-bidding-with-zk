import { authService } from "@services/auth0Service";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NoAuthGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/verify-email") {
    } else {
      if (authService.isAuthenticated()) {
        // router.replace("/home");
      }
    }
  }, []);

  return (
    <>
      <div className="page-content">{children}</div>
    </>
  );
};

export default NoAuthGuard;
