"use client";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { captureException } from "@sentry/nextjs";
import Link from "next/link";
import { useState } from "react";
import type { FieldError, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { IBody, IPostRoutes } from "shared";
import { zRoutes } from "shared";

import { Artwork } from "@/components/artwork/Artwork";
import { ApiError, apiPost } from "@/utils/api.utils";
import { PAGES } from "@/utils/routes.utils";

import { LoginEmailSentModal } from "./LoginEmailSent";

type Inputs = IBody<IPostRoutes["/_private/auth/login-request"]>;

function getInputState(error: FieldError | undefined | null): {
  state: "default" | "error" | "success";
  stateRelatedMessage: string;
} {
  if (!error) {
    return { state: "default", stateRelatedMessage: "" };
  }

  return { state: "error", stateRelatedMessage: error.message ?? "Erreur de validation" };
}

export function LoginModal() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(zRoutes.post["/_private/auth/login-request"].body),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setSubmitError(null);
      await apiPost("/_private/auth/login-request", { body: data });
      setSentTo(data.email);
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError && error.context.statusCode < 500) {
        setSubmitError(`Une erreur est survenue lors de l'envoi du formulaire : ${error.context.message}`);
      } else {
        captureException(error);
        setSubmitError("Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer ultérieurement.");
      }
    }
  };

  if (sentTo) {
    return <LoginEmailSentModal email={sentTo} />;
  }

  return (
    <Dialog
      open
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
      fullScreen
      scroll="paper"
      PaperProps={{
        sx: {
          display: "flex",
          backgroundColor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <DialogContent
        sx={{
          maxWidth: "md",
          padding: fr.spacing("5w"),
        }}
      >
        <Box sx={{ textAlign: "right", marginBottom: fr.spacing("2w") }}>
          <Box component={Link} href={PAGES.static.home.getPath()} sx={{ backgroundImage: "none" }}>
            <Button priority="tertiary" iconId="fr-icon-close-line" iconPosition="right">
              Fermer
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: fr.spacing("5w"),
            marginBottom: fr.spacing("3w"),
            gap: fr.spacing("5w"),
            border: "1px solid var(--light-border-default-grey, #DDD)",
            background: "var(--light-background-default-grey, #FFF)",
          }}
        >
          <Artwork name="designer" />
          <Box>
            <Typography
              variant="h1"
              align="center"
              id="login-modal-title"
              sx={{
                marginBottom: fr.spacing("3w"),
                color: fr.colors.decisions.text.label.blueEcume.default,
              }}
            >
              Se connecter / S’inscrire
            </Typography>
            <Typography id="login-modal-description" className={fr.cx("fr-text--lead")}>
              <strong> Obtenez et gérez vos jetons d’accès</strong> à l’API Apprentissage
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              label={"Merci de saisir votre adresse email"}
              {...getInputState(errors?.email)}
              nativeInputProps={register("email", { required: true })}
            />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button
                size="large"
                priority="primary"
                type="submit"
                disabled={isSubmitting}
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
              >
                Continuer
              </Button>
            </Box>
          </Box>
          {submitError && (
            <Box sx={{ marginTop: fr.spacing("2w") }}>
              <Alert description={submitError} severity="error" small />
            </Box>
          )}

          <Typography textAlign="center" color={fr.colors.decisions.text.default.grey.default}>
            Nous vous enverrons un lien qui vous permettra de vous connecter à votre compte ou de vous inscrire, sans
            mot de passe
          </Typography>
        </Box>
        <Typography textAlign="center" color={fr.colors.decisions.text.default.grey.default}>
          Vous rencontrez des problèmes pour vous identifier, contactez-nous :{" "}
          <Box
            component="a"
            href="mailto:support_api@apprentissage.beta.gouv.fr"
            sx={{ color: fr.colors.decisions.text.actionHigh.blueFrance.default }}
          >
            support_api@apprentissage.beta.gouv.fr
          </Box>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
