import { Languages, MessageCircleMore, Send, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveWhatsAppAccessToken } from "@/lib/whatsapp";
import { sendWhatsAppMessage } from "../actions";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function ConversationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, organizationId } = await requireWorkspace();
  const { data } = await supabase.from("conversations").select("id, channel, status, customer_language, summary, unread_count, last_message_at, leads(full_name)").eq("organization_id", organizationId).order("last_message_at", { ascending: false, nullsFirst: false });
  let whatsappReady = false;
  if (process.env.META_APP_SECRET && process.env.WHATSAPP_VERIFY_TOKEN && process.env.SUPABASE_SECRET_KEY) {
    const admin = createAdminClient();
    const { data: connections } = await admin.from("whatsapp_connections").select("access_token_env_key").eq("organization_id", organizationId).eq("status", "active");
    whatsappReady = Boolean(connections?.some((connection) => resolveWhatsAppAccessToken(connection.access_token_env_key)));
  }

  return <main className="content"><PageHeader title="المحادثات" subtitle="صندوق واحد لواتساب، الويب والقنوات الاجتماعية مع ترجمة محفوظة." />
    {params.error && <div className="alert error">{params.error}</div>}{params.success && <div className="alert success">{params.success}</div>}
    {!whatsappReady && <div className="connector-notice"><WifiOff size={18} /><div><strong>موصل WhatsApp جاهز للكود وينتظر بيانات Meta</strong><span>بعد إضافة رقم الأعمال والمفاتيح سيبدأ استقبال الرسائل وإرسالها من هذه الشاشة.</span></div></div>}
    <section className="panel"><div className="panel-head"><div><h2>صندوق الوارد</h2><p>{data?.length ?? 0} محادثة</p></div><Languages size={20} /></div><div className="cards-list">{(data ?? []).map((item) => { const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads; return <div className="conversation-card" key={item.id}><div className="conversation-row"><div className="channel-icon"><MessageCircleMore size={19} /></div><div><strong>{lead?.full_name ?? "محادثة جديدة"}</strong><span>{item.summary || "لا يوجد ملخص بعد"}</span></div><div className="conversation-side"><span>{item.channel}</span>{item.unread_count > 0 && <b>{item.unread_count}</b>}</div></div>{item.channel === "whatsapp" && <form className="reply-form" action={sendWhatsAppMessage}><input type="hidden" name="conversationId" value={item.id} /><input name="body" maxLength={4096} placeholder={whatsappReady ? "اكتب ردًا للعميل..." : "أكمل ربط Meta أولًا"} disabled={!whatsappReady} required /><button type="submit" disabled={!whatsappReady} aria-label="إرسال"><Send size={17} /></button></form>}</div>})}{!data?.length && <div className="empty-state"><MessageCircleMore size={30} /><strong>لا توجد محادثات بعد</strong><span>ستظهر رسائل WhatsApp هنا بعد ربط رقم الأعمال.</span></div>}</div></section>
  </main>;
}
