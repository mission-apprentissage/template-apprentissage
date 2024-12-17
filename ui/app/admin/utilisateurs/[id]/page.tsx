import { apiGet } from "@/utils/api.utils";

import UserView from "./components/UserView";

interface Props {
  params: { id: string };
}

const AdminUserViewPage = async ({ params }: Props) => {
  //@ts-expect-error: TODO fix this
  const user = await apiGet(`/admin/users/:id`, { params });

  return <UserView user={user} />;
};

export default AdminUserViewPage;
