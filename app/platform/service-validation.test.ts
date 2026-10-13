import { describe, expect, it } from "vitest";
import { parsePlatformServiceStatusInput } from "./service-validation";

const id = "4dd0e486-82df-4fdc-b0f3-a0aaac9fc1a4";
function data(overrides: Record<string,string> = {}) {
  const values = {organization_id:id,service_key:"web_inbox",status:"enabled",reason:"",...overrides};
  const form = new FormData();
  Object.entries(values).forEach(([key,value]) => form.set(key,value));
  return form;
}
describe("platform service control input", () => {
  it("accepts known organization service + status", () => {
    expect(parsePlatformServiceStatusInput(data()).reason).toBeNull();
    expect(parsePlatformServiceStatusInput(data({status:"suspended", reason:"Abuse investigation"})).status).toBe("suspended");
  });
  it.each([
    {organization_id:"invalid"}, {organization_id:""},
    {service_key:"core"}, {service_key:"billing"}, {service_key:"__proto__"},
    {status:"deleted"}, {status:""},
    {status:"disabled",reason:""}, {status:"suspended",reason:"x"},
    {reason:"a".repeat(501)}
  ])("rejects unsafe modification %j", change => {
    expect(() => parsePlatformServiceStatusInput(data(change))).toThrow("Invalid service control request");
  });
});
