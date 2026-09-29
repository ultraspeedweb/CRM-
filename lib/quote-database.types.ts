import type { Database } from "@/lib/database.types";

type QuoteRow = {
  id: string; organization_id: string; deal_id: string; lead_id: string; quote_number: string;
  status: string; currency: string; valid_until: string | null; notes: string | null;
  subtotal: number; discount_total: number; tax_total: number; total: number; created_by: string;
  created_at: string; updated_at: string; sent_at: string | null; accepted_at: string | null;
};
type QuoteInsert = Omit<QuoteRow,"id"|"quote_number"|"created_at"|"updated_at"|"sent_at"|"accepted_at"|"status"> & {id?:string;quote_number?:string;created_at?:string;updated_at?:string;sent_at?:string|null;accepted_at?:string|null;status?:string};
type QuoteUpdate = Partial<QuoteInsert> & {status?:string;accepted_at?:string|null;sent_at?:string|null};
type QuoteItemRow = {id:string;organization_id:string;quote_id:string;sort_order:number;description:string;quantity:number;unit_price:number;discount_percent:number;tax_percent:number;line_subtotal:number;line_discount:number;line_tax:number;line_total:number;created_at:string};
type QuoteItemInsert = Omit<QuoteItemRow,"id"|"created_at"> & {id?:string;created_at?:string};

type QuoteTables = {
  quotes:{Row:QuoteRow;Insert:QuoteInsert;Update:QuoteUpdate;Relationships:[]};
  quote_items:{Row:QuoteItemRow;Insert:QuoteItemInsert;Update:Partial<QuoteItemInsert>;Relationships:[]};
};
export type QuoteDatabase = Omit<Database,"public"> & {public:Omit<Database["public"],"Tables"> & {Tables:Database["public"]["Tables"] & QuoteTables}};
