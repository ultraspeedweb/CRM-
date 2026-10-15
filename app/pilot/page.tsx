import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShieldCheck, CalendarDays, Users } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale } from "@/lib/i18n";

const offers = {
  tr: {
    label:"KURUCU PİLOT · SINIRLI KATILIM", title:"Satış ekibiniz için kontrollü başlangıç.",
    intro:"SatışDesk'in 5 kişiye kadar bir satış ekibi için kurulumunu, süreç tasarımını, ilk veri aktarımını ve eğitimi kapsayan yönetilen pilot programı.",
    price:"50.000 ₺", unit:"Kurulum + ilk ay", note:"KDV ve üçüncü taraf WhatsApp / Meta ücretleri ayrıca. Ödeme sadece doğrulanmış teklif ve yazılı sözleşmeyle alınır.",
    heading:"Neler dahil?", items:["Şirket çalışma alanı ve 5 kullanıcıya kadar kurulum","İlk müşteri verilerinin izinli içe aktarımı","Satış aşamaları ve takip sorumlularının yapılandırılması","Ekip başlangıç eğitimi ve ilk ay yönetilen destek"],
    boundary:"WhatsApp etkinleştirmesi Meta onayı ve müşterinin yetkili işletme numarasına bağlıdır. AI satış ajanları ve otomatik satış artışı garanti edilmez.",
    target:"Kimler için?", targetText:"Türkiye'de Arapça, Türkçe veya İngilizce çalışan; 3–20 kişilik ekiplerle WhatsApp ve web kanallarından müşteri yöneten şirketler.",
    steps:"Nasıl başlanır?", process:["İhtiyaç görüşmesi","Erişim ve veri koruma kontrolü","Yazılı kapsam + fiyat onayı","Teknik geçiş kapısı sonrası kurulum"],
    cta:"Ön görüşme için hesap oluştur", login:"Giriş", prices:"Paketler", compliance:"Müşteri ortamı yalnızca ticari ve güvenlik testleri tamamlandıktan sonra etkinleştirilir."
  },
  ar: {
    label:"البرنامج التأسيسي · مقاعد محدودة", title:"إطلاق منظم لفريق المبيعات لديك.",
    intro:"برنامج تأسيسي مُدار لتجهيز SatışDesk لفريق يصل إلى خمسة مستخدمين، يتضمن إعداد المسار واستيراد البيانات الأولية المصرّح بها والتدريب.",
    price:"50,000 ₺",unit:"الإعداد + أول شهر",note:"ضريبة القيمة المضافة ورسوم WhatsApp/Meta الخارجية منفصلة. لا يُطلب الدفع إلا بعد عرض موثّق وعقد مكتوب.",
    heading:"ما الذي يتضمنه؟",items:["إعداد مساحة الشركة لما يصل إلى 5 مستخدمين","استيراد أول بيانات العملاء بموافقة صريحة","تهيئة مراحل المبيعات والمتابعات والمسؤوليات","تدريب الفريق ودعم تشغيلي خلال الشهر الأول"],
    boundary:"تفعيل واتساب مشروط بموافقة Meta وامتلاك العميل رقماً تجارياً مخوّلاً. لا نضمن زيادة المبيعات ولا وجود وكيل AI جاهز دون شهادة تشغيل.",
    target:"لمن يناسب؟",targetText:"شركات تركيا ذات فرق من 3 إلى 20 موظفاً وتبيع عبر واتساب والموقع، بالعربية أو التركية أو الإنجليزية.",
    steps:"كيف نبدأ؟",process:["اجتماع لفهم الاحتياج","التحقق من الوصول وحماية البيانات","عرض نطاق وسعر وعقد مكتوب","التجهيز بعد اجتياز بوابات التشغيل"],
    cta:"إنشاء حساب لبدء التقييم",login:"دخول",prices:"الباقات",compliance:"لا يتم تفعيل بيئة العميل قبل اعتماد اختبارات التشغيل والأمان التجاري."
  },
  en: {
    label:"FOUNDING PILOT · LIMITED INTAKE",title:"A controlled launch for your sales team.",
    intro:"Managed SatışDesk pilot for up to five users, including workspace setup, initial authorized data import, pipeline configuration and training.",
    price:"TRY 50,000",unit:"Setup + first month",note:"VAT and external WhatsApp / Meta costs are additional. Payment is requested only after a verified written proposal and contract.",
    heading:"Included in the pilot",items:["Company workspace setup for up to five users","Consent-based import of first customer records","Sales stages, ownership and follow-up configuration","Team onboarding and managed support during month one"],
    boundary:"WhatsApp activation requires Meta approval and a customer-owned authorized business number. No guaranteed sales outcomes or uncertified AI agent claims.",
    target:"Who is it for?",targetText:"Türkiye-based teams of 3–20 people managing multilingual Arabic, Turkish or English leads from WhatsApp and web.",
    steps:"What happens next?",process:["Discovery conversation","Access and data protection check","Written scope and price approval","Onboarding after technical release gates pass"],
    cta:"Create account to start evaluation",login:"Sign in",prices:"Plans",compliance:"Customer workspaces are enabled only after commercial security and runtime certification."
  }
} as const;


const questions = {
 tr: { title:"Sık sorulan sorular", items:[["WhatsApp hemen çalışır mı?","Hayır. Bağlantı ancak müşterinin Meta Business yetkisi, onayı ve sağlayıcı doğrulaması tamamlandığında açılır."],["Ücret ne zaman alınır?","Yazılı kapsam, sözleşme ve fatura adımlarından sonra. Bu sayfadan ödeme alınmaz."],["Mevcut verilerimiz aktarılabilir mi?","Yalnızca şirketin yetkilendirdiği ve veri koruma şartları doğrulanmış kayıtlar; aktarım önce örnek veriyle kontrol edilir."]] },
 ar: { title:"الأسئلة الشائعة", items:[["هل يعمل واتساب فوراً؟","لا. يبدأ الربط بعد تفويض الشركة وموافقة Meta والتحقق من جهة التكامل."],["متى يتم تحصيل الرسوم؟","بعد عرض مكتوب وعقد وفاتورة. هذه الصفحة لا تجمع مدفوعات."],["هل يمكن نقل بياناتنا القديمة؟","فقط السجلات المصرح بها وبعد التحقق من متطلبات حماية البيانات واختبار عينة أولاً."]] },
 en: { title:"Frequently asked questions", items:[["Does WhatsApp work immediately?","No. Activation requires customer authorization, Meta approval and provider verification."],["When is payment collected?","Only after a written scope, contract and invoice. This page does not collect payments."],["Can we import existing records?","Only authorized records after a data-protection check and sample reconciliation."]] }
} as const;

export default async function PilotPage(){
 const locale=await getLocale();const c=offers[locale];const faq=questions[locale];
 return <main className="landing">
  <nav className="landing-nav"><Link className="logo-lockup" href="/"><span className="brand-mark">S</span><strong>SatışDesk</strong></Link><div><LanguageSwitcher locale={locale} next="/pilot"/><Link href="/pricing">{c.prices}</Link><Link href="/login" className="secondary-button">{c.login}</Link></div></nav>
  <section className="landing-hero" style={{minHeight:500}}>
   <div className="hero-copy"><span className="hero-pill">{c.label}</span><h1 style={{fontSize:"clamp(38px,4.8vw,65px)"}}>{c.title}</h1><p>{c.intro}</p><div className="hero-actions"><Link className="primary-button" href="/login?mode=signup">{c.cta}<ArrowLeft size={17}/></Link></div></div>
   <article className="price-card" style={{background:"#123e2d",color:"#fff"}}><span>{c.unit}</span><strong>{c.price}</strong><small>{c.note}</small><p style={{lineHeight:1.8,fontSize:13}}><ShieldCheck size={17} style={{display:"inline",verticalAlign:"middle",marginInlineEnd:8}}/>{c.compliance}</p></article>
  </section>
  <section className="landing-section" style={{paddingTop:25}}>
    <div className="section-heading"><h2>{c.heading}</h2></div>
    <div className="outcome-grid">{c.items.map(item=><article key={item}><CheckCircle2 size={23}/><h3>{item}</h3></article>)}</div>
    <div style={{maxWidth:950,margin:"38px auto",display:"grid",gap:20,gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
      <article className="plan-card"><Users size={26}/><h2>{c.target}</h2><p>{c.targetText}</p></article>
      <article className="plan-card"><CalendarDays size={26}/><h2>{c.steps}</h2><ol>{c.process.map(s=><li key={s} style={{marginBottom:12}}>{s}</li>)}</ol></article>
    </div>
    <p style={{maxWidth:850,margin:"0 auto",textAlign:"center",color:"#718078",lineHeight:1.8}}>{c.boundary}</p>
  </section>
 </main>
}
