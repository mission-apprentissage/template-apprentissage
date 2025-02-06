"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Snackbar, Typography } from "@mui/material";
import { captureException } from "@sentry/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FieldError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zRoutes } from "shared";
import type { IOrganisation } from "shared/src/models/organisation.model";
import type { IUserAdminView } from "shared/src/models/user.model";
import type { Jsonify } from "type-fest";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { apiPut } from "@/utils/api.utils";
import { formatDate, formatNullableDate } from "@/utils/date.utils";
import { PAGES } from "@/utils/routes.utils";

type Props = {
  user: Jsonify<IUserAdminView>;
  organisations: Jsonify<IOrganisation[]>;
};

function getInputState(error: FieldError | undefined | null): {
  state: "default" | "error" | "success";
  stateRelatedMessage: string;
} {
  if (!error) {
    return { state: "default", stateRelatedMessage: "" };
  }

  return { state: "error", stateRelatedMessage: error.message ?? "Erreur de validation" };
}

export default function UserView({ user, organisations }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    trigger,
  } = useForm<Props["user"]>({
    mode: "all",
    resolver: zodResolver(zRoutes.put["/_private/admin/users/:id"].body),
    defaultValues: {
      ...user,
      cgu_accepted_at: formatNullableDate(user.cgu_accepted_at, "PPP à p"),
      updated_at: formatDate(user.updated_at, "PPP à p"),
      created_at: formatDate(user.created_at, "PPP à p"),
    },
  });

  const isAdminControl = control.register("is_admin");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Props["user"]) => {
      await apiPut("/_private/admin/users/:id", {
        params: { id: user._id },
        body: {
          ...data,
          organisation: data.organisation === "" ? null : data.organisation,
        },
      });
    },
    onError: (error) => {
      captureException(error);
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/_private/admin/users"] });
    },
  });

  if (mutation.isError) {
    captureException(mutation.error);
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.static.adminUsers, PAGES.dynamic.adminUserView(user._id)]} />
      <Typography variant="h2" gutterBottom>
        Fiche utilisateur
      </Typography>

      {mutation.isError && (
        <Box sx={{ marginTop: fr.spacing("2w") }}>
          <Alert description={mutation.error.message} severity="error" small />
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={mutation.isSuccess}
        onClose={() => mutation.reset()}
        autoHideDuration={5000}
        sx={{
          textWrap: "wrap",
          overflowWrap: "anywhere",
          maxWidth: fr.breakpoints.values.sm,
          backgroundColor: fr.colors.decisions.background.default.grey.default,
          top: [`160px !important`, `160px !important`, `160px !important`, `200px !important`],
        }}
      >
        <Alert description="Sauvegardé" severity="success" small />
      </Snackbar>

      {mutation.isSuccess && <Box sx={{ marginTop: fr.spacing("2w") }}></Box>}

      <Box component="form" onSubmit={handleSubmit(async (d) => mutation.mutateAsync(d))}>
        <Input label="Email" nativeInputProps={control.register("email")} {...getInputState(errors?.email)} />

        <Select
          label={<Typography>Organisation</Typography>}
          nativeSelectProps={control.register("organisation")}
          {...getInputState(errors?.organisation)}
        >
          <option value="">Selectionnez une option</option>
          {organisations.map((o) => (
            <option key={o.nom} value={o.nom}>
              {o.nom}
            </option>
          ))}
        </Select>

        <ToggleSwitch
          label="Administrateur"
          labelPosition="left"
          showCheckedHint={false}
          inputTitle={isAdminControl.name}
          checked={getValues("is_admin")}
          onChange={(v) => {
            setValue("is_admin", v, { shouldTouch: true });
            trigger("is_admin");
          }}
        />
        <Input label="Type" nativeInputProps={control.register("type")} {...getInputState(errors?.type)} />
        <Input label="Activite" textArea nativeTextAreaProps={control.register("activite")} disabled />
        <Input label="Objectif" nativeInputProps={control.register("objectif")} disabled />
        <Input label="Cas Usage" textArea nativeTextAreaProps={control.register("cas_usage")} disabled />
        <Input label="CGU Accépté le" nativeInputProps={control.register("cgu_accepted_at")} disabled />
        <Input label="Mise à jour le" nativeInputProps={control.register("updated_at")} disabled />
        <Input label="Créé le" nativeInputProps={control.register("created_at")} disabled />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Button size="large" type="submit" disabled={isSubmitting}>
            Sauvegarder
          </Button>
        </Box>
      </Box>

      <Typography variant="h3" gutterBottom marginTop={fr.spacing("5w")}>
        Clés API
      </Typography>
      <Table
        fixed
        headers={["Nom", "Dernière utilisation", "Créé le", "Expire le"]}
        data={user.api_keys.map((k) => [
          k.name,
          formatNullableDate(k.last_used_at, "PPP à p"),
          formatDate(k.created_at, "PPP à p"),
          formatDate(k.expires_at, "PPP à p"),
        ])}
      ></Table>
    </>
  );
}
