"use client";
import { Box, Typography } from "@mui/material";
import { ProcessorStatusTaskComponent } from "job-processor/dist/react";
import { use } from "react";

import { ProcessorStatusProvider } from "@/app/admin/processeur/components/ProcessorStatusProvider";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { publicConfig } from "@/config.public";
import { PAGES } from "@/utils/routes.utils";

export default function JobInstancePage({ params }: { params: Promise<{ name: string; id: string }> }) {
  const { name: rawName, id: rawId } = use(params);
  const name = decodeURIComponent(rawName);
  const id = decodeURIComponent(rawId);

  return (
    <Box>
      <Breadcrumb
        pages={[
          PAGES.static.adminProcessor,
          PAGES.dynamic.adminProcessorCron(name),
          PAGES.dynamic.adminProcessorCronTask({ name, id }),
        ]}
      />
      <Typography variant="h2" gutterBottom>
        {PAGES.dynamic.adminProcessorCronTask({ name, id }).getTitle()}
      </Typography>
      <ProcessorStatusProvider>
        {(status) => (
          <ProcessorStatusTaskComponent
            name={name}
            status={status}
            baseUrl={new URL(PAGES.static.adminProcessor.getPath(), publicConfig.baseUrl).href}
            id={id}
            type="cron"
          />
        )}
      </ProcessorStatusProvider>
    </Box>
  );
}
