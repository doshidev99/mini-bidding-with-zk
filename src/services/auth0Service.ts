import auth0, {
  AuthorizeOptions,
  DbSignUpOptions,
  LoginOptions,
} from "auth0-js";
import jwt_decode from "jwt-decode";
import Router from "next/router";
import toast from "react-hot-toast";
import {
  ACCESS_TOKEN,
  EMAIL_VERIFY,
  EXPIRES_AT,
  ID_TOKEN,
  REFRESH_TOKEN,
} from "../utils/constants";
import { LocalStorage } from "../utils/newLocalstorage";

export const urlCheckRole = process.env.NEXT_PUBLIC_API_URL_CHECK_ROLE!;

export const decodeJWT = (accessToken: string) => {
  const decoded = jwt_decode(accessToken) as {
    email: string;
  };
  return decoded;
};

export const getJWTParse = (idToken?: string) => {
  const jwtDecoded = decodeJWT(idToken || LocalStorage.get(ID_TOKEN)) as any;
  return jwtDecoded;
};

console.log(process.env.NEXT_PUBLIC_AUTH_DOMAIN!);
const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
  clientID: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!,
  audience: process.env.NEXT_PUBLIC_AUTH_AUDIENCE!,
  redirectUri: process.env.NEXT_PUBLIC_AUTH_URI!,
  responseType: "code",
  scope: process.env.NEXT_PUBLIC_AUTH_SCOPE!,
};

export class AuthService {
  webAuth = new auth0.WebAuth(auth0Config);
  authenticate = new auth0.Authentication(auth0Config);

  login(params?: AuthorizeOptions) {
    this.webAuth.authorize({ ...params, prompt: "select_account" });
  }

  loginWithSocial(connection: TSocialProvider) {
    this.webAuth.authorize({
      connection: connection,
      prompt: "select_account",
    });
  }

  loginWithUser({ username, password }: LoginOptions) {
    return new Promise((resolve, reject) => {
      this.webAuth.client.loginWithDefaultDirectory(
        {
          username,
          password,
        },
        (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            resolve(true);
          } else if (err) {
            reject(err);
          }
        }
      );
    });
  }

  register({ email, password }: Pick<DbSignUpOptions, "email" | "password">) {
    return new Promise((resolve, reject) => {
      this.webAuth.signupAndAuthorize(
        {
          email,
          password,
          connection: "BAM-Users",
        },
        (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            resolve(true);
          } else if (err) {
            reject(err);
          }
        }
      );
    });
  }

  refreshToken() {
    const options = {
      grantType: "refresh_token",
      refresh_token: LocalStorage.get(REFRESH_TOKEN),
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!,
    };
    this.authenticate.oauthToken(options, (err, authResult) => {
      if (authResult) {
        this.updateStorage(authResult);
      } else {
        this.logout();
      }
    });
  }

  resetPassword({ email }: { email: string }) {
    return new Promise((resolve, reject) => {
      this.webAuth.changePassword(
        {
          email,
          connection: "BAM-Users",
        },
        (err, authResult) => {
          if (authResult) {
            resolve(true);
            toast.success(authResult);
          } else if (err) {
            reject(err);
          }
        }
      );
    });
  }

  clearAll() {
    LocalStorage.clear();
    Router.replace("/login");
    return;
  }

  setSession(authResult: any) {
    if (!authResult.accessToken || !authResult.idToken) {
      this.clearAll();
      return;
    }

    const dataParse = getJWTParse(authResult.idToken);
    const isEmailVerify = dataParse?.[urlCheckRole]?.email_verified || false;

    if (isEmailVerify) {
      const expiresAt = authResult?.expiresIn
        ? JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
        : 0;
      LocalStorage.set(ACCESS_TOKEN, authResult.accessToken);
      LocalStorage.set(ID_TOKEN, authResult.idToken);
      LocalStorage.set(EXPIRES_AT, expiresAt);
      LocalStorage.set(REFRESH_TOKEN, authResult.refreshToken);
      Router.replace("/");
    } else {
      if (dataParse.email) {
        Router.replace("/verify-email?email=" + dataParse.email);
      } else {
      }
    }
  }

  updateStorage(authResult: any) {
    if (!authResult.accessToken || !authResult.idToken) {
      this.clearAll();
      return;
    }
    const expiresAt = authResult?.expiresIn
      ? JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
      : 0;
    LocalStorage.set(ACCESS_TOKEN, authResult.accessToken);
    LocalStorage.set(EXPIRES_AT, expiresAt);
  }

  handleAuthentication = () => {
    const searchParams = new URLSearchParams(window.location.search);
    this.webAuth.client.oauthToken(
      {
        code: searchParams.get("code"),
        state: searchParams.get("state"),
        grantType: "authorization_code",
        redirectUri: auth0Config.redirectUri,
      },
      (err, authResult) => {
        console.log(authResult);
        if (authResult) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }
      }
    );
  };

  logout() {
    return new Promise((resolve) => {
      LocalStorage.clear();
      this.webAuth.logout({
        returnTo: process.env.NEXT_PUBLIC_AUTH_LOGOUT_RETURN!,
        clientID: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!,
      });
      resolve(true);
    });
  }

  isEmailVerified() {
    return LocalStorage.get(EMAIL_VERIFY);
  }

  isAuthenticated = () => {
    const accessToken = LocalStorage.get(ACCESS_TOKEN);
    return !!accessToken;
  };
}

export const handleLogout = () => {
  const authService = new AuthService();
  return authService.logout();
};

export const authService = new AuthService();
