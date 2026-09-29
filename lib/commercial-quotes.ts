export const quoteStatuses = ["draft","sent","accepted","rejected","expired"] as const;
export type QuoteStatus = typeof quoteStatuses[number];
export type QuoteLineInput = {quantity:number;unitPrice:number;discountRate:number;taxRate:number};

const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function calculateQuoteLine(line:QuoteLineInput){
  if(!Number.isFinite(line.quantity)||line.quantity<=0) throw new Error("Invalid quantity");
  if(!Number.isFinite(line.unitPrice)||line.unitPrice<0) throw new Error("Invalid unit price");
  if(line.discountRate<0||line.discountRate>100||line.taxRate<0||line.taxRate>100) throw new Error("Invalid rate");
  const subtotal=money(line.quantity*line.unitPrice);
  const discount=money(subtotal*line.discountRate/100);
  const taxable=money(subtotal-discount);
  const tax=money(taxable*line.taxRate/100);
  return {subtotal,discount,tax,total:money(taxable+tax)};
}

export function calculateQuote(lines:QuoteLineInput[]){
  if(!lines.length) return {subtotal:0,discountAmount:0,taxAmount:0,total:0};
  return lines.map(calculateQuoteLine).reduce((a,l)=>({subtotal:money(a.subtotal+l.subtotal),discountAmount:money(a.discountAmount+l.discount),taxAmount:money(a.taxAmount+l.tax),total:money(a.total+l.total)}),{subtotal:0,discountAmount:0,taxAmount:0,total:0});
}

const transitions:Record<QuoteStatus,QuoteStatus[]>={draft:["sent"],sent:["accepted","rejected","expired"],accepted:[],rejected:[],expired:[]};
export function canTransitionQuoteStatus(from:string,to:string){return quoteStatuses.includes(from as QuoteStatus)&&quoteStatuses.includes(to as QuoteStatus)&&transitions[from as QuoteStatus].includes(to as QuoteStatus);}

export function buildQuoteNumber(now=new Date(),suffix=Math.random().toString(36).slice(2,7).toUpperCase()){
  const date=now.toISOString().slice(0,10).replaceAll("-","");
  return `Q-${date}-${suffix}`;
}
