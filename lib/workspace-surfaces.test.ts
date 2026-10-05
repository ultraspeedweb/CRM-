import { describe, expect, it } from "vitest";
import {
  canUseExecutionSurface,
  canUseManagementSurface,
  isOrganizationRole,
  workspaceHomeForRole,
  workspaceSurfaceForRole,
} from "./workspace-surfaces";

describe("workspace role/surface contract", () => {
  it.each([
    ["owner", "command", "/command"],
    ["admin", "command", "/command"],
    ["manager", "command", "/command"],
    ["agent", "work", "/work"],
    ["viewer", "insights", "/insights"],
  ] as const)("routes %s to its governed surface", (role, surface, home) => {
    expect(isOrganizationRole(role)).toBe(true);
    expect(workspaceSurfaceForRole(role)).toBe(surface);
    expect(workspaceHomeForRole(role)).toBe(home);
  });

  it("fails unknown roles toward the non-management insights surface", () => {
    expect(isOrganizationRole("platform_owner")).toBe(false);
    expect(isOrganizationRole("unknown")).toBe(false);
    expect(workspaceSurfaceForRole("unknown")).toBe("insights");
    expect(workspaceHomeForRole("unknown")).toBe("/insights");
    expect(canUseManagementSurface("unknown")).toBe(false);
    expect(canUseExecutionSurface("unknown")).toBe(false);
  });

  it.each(["owner", "admin", "manager"])("allows %s to use management and execution surfaces", (role) => {
    expect(canUseManagementSurface(role)).toBe(true);
    expect(canUseExecutionSurface(role)).toBe(true);
  });

  it("keeps agent execution-only and viewer read-only", () => {
    expect(canUseManagementSurface("agent")).toBe(false);
    expect(canUseExecutionSurface("agent")).toBe(true);
    expect(canUseManagementSurface("viewer")).toBe(false);
    expect(canUseExecutionSurface("viewer")).toBe(false);
  });
});
