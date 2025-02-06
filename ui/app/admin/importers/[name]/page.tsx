"use client";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { use } from "react";

import { useImporterStatus } from "@/app/admin/hooks/useImporterStatus";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { Table } from "@/components/table/Table";
import { formatNullableDate } from "@/utils/date.utils";
import { PAGES } from "@/utils/routes.utils";

export default function AdminImporterPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = use(params);
  const name = decodeURIComponent(rawName);

  const result = useImporterStatus();

  if (result.isError) {
    throw result.error;
  }

  if (result.isLoading || result.isPending) {
    return <Loading />;
  }

  const data = result.data[name];

  if (!data) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.static.adminImporters, PAGES.dynamic.adminImporterView(name)]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.dynamic.adminImporterView(name).getTitle()}
      </Typography>
      <Box>
        <Typography gutterBottom>Statut: {data.status}</Typography>
        <Typography gutterBottom>
          Last Import:
          {formatNullableDate(data.last_import, "PPP à p")}
        </Typography>
        <Typography gutterBottom>
          Last Success:
          {formatNullableDate(data.last_success, "PPP à p")}
        </Typography>
      </Box>
      <Typography variant="h3" gutterBottom>
        Resources
      </Typography>
      <Table
        rows={data.resources}
        getRowId={(row) => row.name}
        columns={[
          {
            field: "name",
            headerName: "Name",
            flex: 3,
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
          },
          {
            field: "import_date",
            headerName: "Import Date",
            flex: 1,
            valueGetter: (value) => formatNullableDate(value, "PPP à p"),
          },
        ]}
      />
    </>
  );
}
