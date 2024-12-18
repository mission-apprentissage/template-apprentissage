import type { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Header as DSFRHeader } from "@codegouvfr/react-dsfr/Header";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { publicConfig } from "@/config.public";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/utils/api.utils";

import { useNavigationItems } from "./header.utils";

export const Header = () => {
  const { user, setUser } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    await apiGet("/_private/auth/logout", {});
    setUser(null);
    push(PAGES.homepage().path);
  }, [setUser, push]);

  //@ts-expect-error: TODO fix this
  const navigation = useNavigationItems({ user, pathname });

  const loggedOut: HeaderProps.QuickAccessItem[] = useMemo(
    () => [
      {
        iconId: "fr-icon-lock-line",
        linkProps: {
          href: PAGES.connexion().path,
        },
        text: "Se connecter",
      },
    ],
    []
  );

  const loggedIn: HeaderProps.QuickAccessItem[] = useMemo(
    () => [
      {
        linkProps: {
          href: PAGES.compteProfil().path,
        },
        iconId: "fr-icon-account-line",
        text: "Mon compte",
      },
      {
        buttonProps: {
          onClick: handleLogout,
        },
        text: "Se deconnecter",
        iconId: "fr-icon-logout-box-r-line",
      },
    ],
    [handleLogout]
  );

  return (
    <DSFRHeader
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: `Accueil - ${publicConfig.productMeta.productName}`,
      }}
      quickAccessItems={user ? loggedIn : loggedOut}
      serviceTitle={publicConfig.productMeta.productName}
      navigation={navigation}
    />
  );
};
