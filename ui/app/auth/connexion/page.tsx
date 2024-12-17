"use client";

import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { IBody, IPostRoutes } from "shared";
import type { IStatus } from "shared/src/routes/_private/auth.routes";

import FormContainer from "@/app/auth/components/FormContainer";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/utils/api.utils";

type Route = IPostRoutes["/_private/auth/login"];

const ConnexionPage = () => {
  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState<IStatus>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    //@ts-expect-error: TODO fix this
  } = useForm<IBody<Route>>();
  //@ts-expect-error: TODO fix this
  const onSubmit: SubmitHandler<IBody<Route>> = async (data) => {
    try {
      //@ts-expect-error: TODO fix this
      setUser(await apiPost("/_private/auth/login", { body: data }));
    } catch (error) {
      const errorMessage = (error as Record<string, string>)?.message;

      setStatus({
        error: true,
        message: errorMessage ?? "Impossible de se connecter.",
      });

      console.error(error);
    }
  };

  if (user) {
    return push("/");
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.connexion()]} />
      <FormContainer>
        <Typography variant="h2" gutterBottom>
          Connectez-vous
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email (votre identifiant)"
            //@ts-expect-error: TODO fix this
            state={errors.email ? "error" : "default"}
            //@ts-expect-error: TODO fix this
            stateRelatedMessage={errors.email?.message}
            nativeInputProps={{
              placeholder: "prenom.nom@courriel.fr",
              //@ts-expect-error: TODO fix this
              ...register("email", { required: "Email obligatoire" }),
            }}
          />
          <PasswordInput
            label="Mot de passe"
            messagesHint="Mot de passe incorrect"
            messages={
              //@ts-expect-error: TODO fix this
              errors.password?.message
                ? [
                    {
                      //@ts-expect-error: TODO fix this
                      message: errors.password?.message,
                      severity: "error",
                    },
                  ]
                : []
            }
            nativeInputProps={{
              placeholder: "****************",
              //@ts-expect-error: TODO fix this
              ...register("password", {
                required: "Mot de passe obligatoire",
              }),
            }}
          />
          {status?.message && <Alert description={status.message} severity="error" small />}
          <Box mt={2}>
            <Button type="submit">Connexion</Button>
            <Button
              linkProps={{
                href: PAGES.motDePasseOublie().path,
              }}
              priority="tertiary no outline"
            >
              Mot de passe oublié
            </Button>
          </Box>
        </form>
      </FormContainer>
    </>
  );
};
export default ConnexionPage;
