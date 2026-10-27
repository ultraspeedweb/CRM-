export const ORGANIZATION_ROLES = ["owner", "admin", "manager", "agent", "viewer"] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];
export type WorkspaceSurface = "command" | "work" | "insights";

const MANAGER_ROLES = new Set<OrganizationRole>(["owner", "admin", "manager"]);

export function isOrganizationRole(value: string): value is OrganizationRole {
  return (ORGANIZATION_ROLES as readonly string[]).includes(value);
}

export function workspaceSurfaceForRole(role: string): WorkspaceSurface {
  if (role === "agent") return "work";
  if (role === "viewer") return "insights";
  if (isOrganizationRole(role) && MANAGER_ROLES.has(role)) return "command";

  // Unknown roles never receive management UI by fallback.
  return "insights";
}

export function workspaceHomeForRole(role: string): `/${WorkspaceSurface}` {
  return `/${workspaceSurfaceForRole(role)}`;
}

export function canUseManagementSurface(role: string): boolean {
  return isOrganizationRole(role) && MANAGER_ROLES.has(role);
}

export function canUseExecutionSurface(role: string): boolean {
  return role === "agent" || canUseManagementSurface(role);
}
