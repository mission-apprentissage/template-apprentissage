import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useMemo } from "react";
import { IUserPublic } from "shared/models/user.model";

import { PAGES } from "../breadcrumb/Breadcrumb";

interface GetNavigationItemsProps {
  user?: IUserPublic;
  pathname: string;
}

const getNavigationItems = ({ user, pathname }: GetNavigationItemsProps): MainNavigationProps.Item[] => {
  let navigation: MainNavigationProps.Item[] = [
    {
      isActive: pathname === PAGES.homepage().path,
      text: "Accueil",
      linkProps: {
        href: PAGES.homepage().path,
      },
    },
  ];

  if (user?.is_admin) {
    navigation = [
      ...navigation,
      {
        text: "Administration",
        isActive: [PAGES.adminUsers().path].includes(pathname),
        menuLinks: [
          {
            text: PAGES.adminUsers().title,
            isActive: pathname === PAGES.adminUsers().path,
            linkProps: {
              href: PAGES.adminUsers().path,
            },
          },
        ],
      },
    ];
  }

  return navigation.map((item) => {
    const { menuLinks } = item;

    const menuLinkWithActive = menuLinks?.map((link) => ({ ...link, isActive: link.linkProps.href === pathname }));
    const isActive = pathname === item.linkProps?.href || menuLinkWithActive?.some((link) => link.isActive);

    return { ...item, isActive, menuLinks };
  }) as MainNavigationProps.Item[];
};

export const useNavigationItems = ({ user, pathname }: GetNavigationItemsProps): MainNavigationProps.Item[] =>
  useMemo(() => getNavigationItems({ user, pathname }), [user, pathname]);
