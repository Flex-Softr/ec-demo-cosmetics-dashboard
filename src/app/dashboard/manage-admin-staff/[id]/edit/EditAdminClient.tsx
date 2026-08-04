"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/const/role";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { TUser } from "@/redux/features/user/userInterface";
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import StaffForm from "../../components/StaffForm";

const isProtectedSystemUser = (user: TUser) =>
  Boolean(user.is_system) || user.role === ROLES.SUPER_ADMIN;

const EditAdminClient = ({ id }: { id: string }) => {
  const { users } = useAppSelector(({ users }) => users);
  const cachedUser = useMemo(
    () => users.find((item) => item._id === id),
    [users, id]
  );

  const { data, isLoading, isError } = useGetAllUsersQuery(
    { search: undefined },
    { skip: Boolean(cachedUser) }
  );

  const user = useMemo(() => {
    if (cachedUser) return cachedUser;
    const list = (data?.data || []) as TUser[];
    return list.find((item) => item._id === id);
  }, [cachedUser, data, id]);

  if (isLoading && !cachedUser) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Edit Admin"
          subtitle="Update admin account details and permissions"
          icon={Pencil}
        />
        <ContentCard>
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading admin…
          </div>
        </ContentCard>
      </div>
    );
  }

  if (!user || (isError && !cachedUser)) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Edit Admin"
          subtitle="Update admin account details and permissions"
          icon={Pencil}
          actions={
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
            >
              <Link href="/dashboard/manage-admin-staff">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          }
        />
        <ContentCard>
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <p>Admin not found.</p>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/dashboard/manage-admin-staff">
                Back to employees
              </Link>
            </Button>
          </div>
        </ContentCard>
      </div>
    );
  }

  if (isProtectedSystemUser(user)) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Edit Admin"
          subtitle="System users cannot be edited"
          icon={Pencil}
          actions={
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
            >
              <Link href="/dashboard/manage-admin-staff">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
          }
        />
        <ContentCard>
          <div className="flex h-40 flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
            <p>
              “{user.fullName || "This account"}” is a system/super admin user.
              Editing or deleting system accounts is not allowed.
            </p>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/dashboard/manage-admin-staff">
                Back to employees
              </Link>
            </Button>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Edit Admin"
        subtitle={`Update “${user.fullName || "admin"}” account and permissions`}
        icon={Pencil}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/manage-admin-staff">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <StaffForm user={user} />
      </ContentCard>
    </div>
  );
};

export default EditAdminClient;
