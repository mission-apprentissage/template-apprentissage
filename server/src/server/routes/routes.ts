import type { Server } from "@/server/server";

import { processorAdminRoutes } from "./_private/admin/processor.admin.routes";
import { userAdminRoutes } from "./_private/admin/user.routes";
import { authRoutes } from "./_private/auth.routes";
import { emailsRoutes } from "./_private/emails.routes";
import { userRoutes } from "./_private/user.routes";
import { healthcheckRoutes } from "./healthcheck.routes";

type RegisterRoutes = (opts: { server: Server }) => void;

export const registerRoutes: RegisterRoutes = ({ server }) => {
  healthcheckRoutes({ server });
  authRoutes({ server });
  userRoutes({ server });
  emailsRoutes({ server });
  userAdminRoutes({ server });
  processorAdminRoutes({ server });
};
