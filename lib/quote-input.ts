import { calculateQuoteTotals, type QuoteItemInput } from "@/lib/quotes";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type QuoteInput={dealId:string;validUntil:string|null;notes:string|null;items:QuoteItemInput[]};
export function parseQuoteInput(formData:FormData):QuoteInput|null{
 const dealId=String(formData.get("dealId")??"").trim(); const validUntil=String(formData.get("validUntil")??"").trim()||null; const notes=String(formData.get("notes")??"").trim().slice(0,2000)||null;
 let raw:unknown; try{raw=JSON.parse(String(formData.get("items")??"[]"));}catch{return null} if(!uuid.test(dealId)||!Array.isArray(raw)||raw.length<1||raw.length>100)return null;
 const items:QuoteItemInput[]=[]; for(const value of raw){if(!value||typeof value!=="object")return null;const v=value as Record<string,unknown>;const item={description:String(v.description??"").trim().slice(0,300),quantity:Number(v.quantity),unitPrice:Number(v.unitPrice),discountPercent:Number(v.discountPercent??0),taxPercent:Number(v.taxPercent??0)};if(!item.description||!Number.isFinite(item.quantity)||item.quantity<=0||!Number.isFinite(item.unitPrice)||item.unitPrice<0||item.discountPercent<0||item.discountPercent>100||item.taxPercent<0||item.taxPercent>100)return null;items.push(item)}
 calculateQuoteTotals(items); return {dealId,validUntil,notes,items};
}
