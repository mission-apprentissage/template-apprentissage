import { Typography } from "@mui/material";
import type { FC } from "react";
import { Suspense } from "react";
import type { IUserPublic } from "shared/src/models/user.model";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import InfoDetails from "@/components/infoDetails/InfoDetails";
import { formatDate } from "@/utils/date.utils";

interface Props {
  user: IUserPublic;
}

const UserView: FC<Props> = ({ user }) => {
  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.adminUsers(), PAGES.adminUserView(user._id)]} />
      <Typography variant="h2" gutterBottom>
        Fiche utilisateur
      </Typography>

      <InfoDetails
        data={user}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          email: {
            header: () => "Email",
          },
          is_admin: {
            header: () => "Administrateur",
            cell: ({ is_admin }) => (is_admin ? "Oui" : "Non"),
          },
          has_api_key: {
            header: () => "Clé d'API générée",
            cell: ({ has_api_key }) => (has_api_key ? "Oui" : "Non"),
          },
          api_key_used_at: {
            header: () => "Dernière utilisation API",
            cell: ({ api_key_used_at }) => {
              return api_key_used_at ? formatDate(api_key_used_at, "PPP à p") : "Jamais";
            },
          },
        }}
      />
    </Suspense>
  );
};

export default UserView;
