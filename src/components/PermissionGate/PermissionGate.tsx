import UsersContainer from "@/src/containers/UsersContainer";
import PermissionKey from "@/src/models/users/PermissionKey";
import { Role } from "@prisma/client";
import { useEffect } from "react";

interface PermissionGateProps {
  permission?: PermissionKey;
  anyPermission?: PermissionKey[];
  allPermissions?: PermissionKey[];
  role?: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  anyPermission,
  allPermissions,
  role,
  children,
  fallback = null,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    initializeFromRemote,
  } = UsersContainer.useContainer();

  useEffect(() => {
    initializeFromRemote();
  }, []);

  if (role && !hasRole(role)) return fallback;
  if (permission && !hasPermission(permission)) return fallback;
  if (anyPermission && !hasAnyPermission(anyPermission)) return fallback;
  if (allPermissions && !hasAllPermissions(allPermissions)) return fallback;

  return <>{children}</>;
};
