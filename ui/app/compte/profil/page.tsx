"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Box, Typography } from "@mui/material";
import { Suspense, useState } from "react";

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import InfoDetails from "@/components/infoDetails/InfoDetails";
import Toast, { useToast } from "@/components/toast/Toast";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/utils/api.utils";
import { formatDate } from "@/utils/date.utils";

const modal = createModal({
  id: "generate-api-key",
  isOpenedByDefault: false,
});

const ProfilPage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | undefined>();
  const { toast, setToast, handleClose } = useToast();

  const handleClick = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setToast({
        severity: "success",
        message: "Jeton API copié dans le presse-papier.",
      });
    }
  };

  const generateApiKey = async () => {
    try {
      // TODO : to fix
      // const data = await apiGet("/user/generate-api-key", {});
      // setApiKey(data.api_key);
    } catch (error) {
      console.error(error);
      setToast({
        severity: "error",
        message: "Une erreur est survenue lors de la génération du jeton API.",
      });
    } finally {
      modal.close();
    }
  };

  if (!user) return null;

  return (
    <Suspense>
      <Breadcrumb pages={[PAGES.compteProfil()]} />
      <Typography variant="h2" gutterBottom>
        Mon compte
      </Typography>
      <InfoDetails
        title="Mes informations"
        data={user}
        rows={{
          email: {
            header: () => "Adresse email",
          },
          is_admin: {
            header: () => "Accès",
            cell: (data) => (data.is_admin ? "Administrateur" : "Utilisateur"),
          },
        }}
      />
      <Typography variant="h4" gutterBottom>
        Jeton API
      </Typography>
      {user.has_api_key ||
        (apiKey && (
          <Input
            label="Jeton API"
            nativeInputProps={{
              value: apiKey ?? "****************************************",
            }}
          />
        ))}
      {apiKey && (
        <>
          <Typography gutterBottom>
            Ce jeton n'est visible qu'une fois, il est recommandé de le stocker dans un endroit sécurisé.
          </Typography>
          <Box my={2}>
            <Button onClick={handleClick}>Copier</Button>
          </Box>
        </>
      )}

      {(user.has_api_key || apiKey) && (
        <Typography>
          {user.api_key_used_at ? (
            <>{`Dernière utilisation le ${formatDate(user.api_key_used_at as unknown as string, "PPP à p")}`}</>
          ) : (
            <>Ce jeton n'a pas encore été utilisé</>
          )}
        </Typography>
      )}

      <modal.Component
        title="Générer un nouveau jeton API"
        buttons={[
          {
            children: "Annuler",
          },
          {
            onClick: () => {
              generateApiKey();
            },
            children: "Générer",
          },
        ]}
      >
        Êtes-vous sûr de vouloir générer un nouveau jeton API ? Le jeton existant ne sera plus utilisable.
      </modal.Component>

      <Box my={2}>
        <Button onClick={async () => (user.has_api_key ? modal.open() : generateApiKey())}>
          Générer un nouveau jeton API
        </Button>
      </Box>

      <Toast severity={toast?.severity} message={toast?.message} onClose={handleClose} />
    </Suspense>
  );
};

export default ProfilPage;
