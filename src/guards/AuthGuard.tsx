import AppHeader from "@components/AppHeader";
import { authService } from "@services/auth0Service";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="app-wrapper">
      <AppHeader />
      <main className="app-content">{children}</main>
    </div>
  );
};

export default AuthGuard;
