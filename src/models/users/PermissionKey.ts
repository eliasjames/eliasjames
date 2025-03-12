
export type PermissionKey =
  | "update:shelter"
  | "update:animal"
  | "delete:animal"
  | "create:location"
  | "update:location"
  | "delete:location"
  | "create:task"
  | "update:task"
  | "assign:task"
  | "delete:task"
  | "create:user"
  | "update:user"
  | "delete:user"
  | "access:medical"
  | "access:behavior"
  | "access:adoption";

  export default PermissionKey;