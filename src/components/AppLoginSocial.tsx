import { Button } from "@mui/material";
import Image from "next/image";
import { authService } from "../services/auth0Service";

const AppLoginSocial = () => {
  const socialList = [
    {
      logo: "/assets/icons/gmail-logo.svg",
      title: "Google",
      provider: "google-oauth2",
    },
    {
      logo: "/assets/icons/twitter-logo.svg",
      title: "Twitter",
      provider: "twitter",
    },
    {
      logo: "/assets/icons/facebook-logo.svg",
      title: "Facebook",
      provider: "facebook",
    },
    {
      logo: "/assets/icons/linkedin-logo.svg",
      title: "Linkedin",
      provider: "linkedin",
    },
  ] as { logo: string; title: string; provider: TSocialProvider }[];

  const socialLogin = (provider: TSocialProvider) => {
    authService.loginWithSocial(provider);
  };

  return (
    <>
      <div className="login-socials">
        {socialList.map(({ provider, logo, title }) => (
          <Button
            sx={{
              minWidth: 240,
              margin: "0 auto",
            }}
            variant="outlined"
            key={provider}
            onClick={() => socialLogin(provider)}
          >
            <div className="icon">
              <Image
                src={logo}
                alt="login"
                width={40}
                height={40}
                objectFit="contain"
              />
            </div>
            {title}
          </Button>
        ))}
      </div>
    </>
  );
};
export default AppLoginSocial;
