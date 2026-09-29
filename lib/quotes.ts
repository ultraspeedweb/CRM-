export type QuoteItemInput={description:string;quantity:number;unitPrice:number;discountPercent:number;taxPercent:number};
const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function calculateQuoteItem(item:QuoteItemInput){
  const subtotal=money(item.quantity*item.unitPrice);
  const discount=money(subtotal*item.discountPercent/100);
  const taxable=money(subtotal-discount);
  const tax=money(taxable*item.taxPercent/100);
  return {subtotal,discount,tax,total:money(taxable+tax)};
}
export function calculateQuoteTotals(items:QuoteItemInput[]){
  return items.map(calculateQuoteItem).reduce((sum,item)=>({subtotal:money(sum.subtotal+item.subtotal),discountTotal:money(sum.discountTotal+item.discount),taxTotal:money(sum.taxTotal+item.tax),total:money(sum.total+item.total)}),{subtotal:0,discountTotal:0,taxTotal:0,total:0});
}
