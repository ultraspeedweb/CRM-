import {describe,expect,it} from "vitest";
import {buildQuoteNumber,calculateQuote,calculateQuoteLine,canTransitionQuoteStatus} from "./commercial-quotes";

describe("WS10 commercial quotes",()=>{
  it("calculates discount before tax",()=>{expect(calculateQuoteLine({quantity:2,unitPrice:100,discountRate:10,taxRate:20})).toEqual({subtotal:200,discount:20,tax:36,total:216});});
  it("aggregates quote totals",()=>{expect(calculateQuote([{quantity:1,unitPrice:100,discountRate:0,taxRate:20},{quantity:2,unitPrice:50,discountRate:10,taxRate:10}])).toEqual({subtotal:200,discountAmount:10,taxAmount:29,total:219});});
  it("rejects unsafe numeric inputs",()=>{expect(()=>calculateQuoteLine({quantity:0,unitPrice:10,discountRate:0,taxRate:0})).toThrow();expect(()=>calculateQuoteLine({quantity:1,unitPrice:10,discountRate:101,taxRate:0})).toThrow();});
  it("enforces forward-only commercial lifecycle",()=>{expect(canTransitionQuoteStatus("draft","sent")).toBe(true);expect(canTransitionQuoteStatus("sent","accepted")).toBe(true);expect(canTransitionQuoteStatus("accepted","draft")).toBe(false);expect(canTransitionQuoteStatus("draft","accepted")).toBe(false);});
  it("builds traceable quote numbers",()=>{expect(buildQuoteNumber(new Date("2026-09-29T12:00:00Z"),"ABCDE")).toBe("Q-20260929-ABCDE");});
});
