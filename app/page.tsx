import Link from "next/link";
import { ArrowLeft, Bot, Check, Globe2, MessageCircleMore, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const outcomes = [
  [MessageCircleMore, "كل المحادثات في مكان واحد", "واتساب والعملاء والمتابعات والصفقات ضمن رحلة واحدة واضحة."],
  [Globe2, "العربية · Türkçe · English", "فريقك والعميل يتحدثان بلغتهما مع حفظ النص الأصلي والترجمة."],
  [TrendingUp, "من الرسالة إلى الصفقة", "اعرف المصدر، سرعة الرد، الموعد وقيمة المسار بدون ملفات متفرقة."],
  [ShieldCheck, "مساحة معزولة لكل مؤسسة", "أدوار وصلاحيات وعزل بيانات على مستوى قاعدة البيانات."],
] as const;

export default function Home() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link className="logo-lockup" href="/"><span className="brand-mark">S</span><strong>SatışDesk</strong></Link>
        <div><a href="#pilot">العرض المؤسس</a><Link className="secondary-button" href="/login">تسجيل الدخول</Link></div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <span className="hero-pill"><Sparkles size={15} /> مركز مبيعات متعدد اللغات للفرق العقارية</span>
          <h1>لا تدع فرصة بيع تضيع بين واتساب والدفاتر.</h1>
          <p>SatışDesk يجمع العميل والمحادثة والمتابعة والموعد والصفقة في شاشة واحدة، ويعطي فريقك مسارًا عمليًا للرد والإغلاق.</p>
          <div className="hero-actions"><Link className="primary-button" href="/login?mode=signup">ابدأ Pilot الآن <ArrowLeft size={17} /></Link><a className="secondary-button" href="#how">شاهد كيف يعمل</a></div>
          <div className="hero-proof"><span><Check size={15} /> إعداد سريع</span><span><Check size={15} /> بدون عقد طويل</span><span><Check size={15} /> رسوم Meta منفصلة وواضحة</span></div>
        </div>
        <div className="hero-console">
          <header><span /><span /><span /><b>LIVE SALES FLOW</b></header>
          <div className="flow-step active"><MessageCircleMore size={19} /><div><strong>رسالة جديدة</strong><small>عميل يسأل بالعربية عن عقار في إسطنبول</small></div><b>الآن</b></div>
          <div className="flow-line" />
          <div className="flow-step"><Bot size={19} /><div><strong>تأهيل ومتابعة</strong><small>حفظ اللغة والميزانية وتذكير الفريق</small></div><b>1 د</b></div>
          <div className="flow-line" />
          <div className="flow-step success"><TrendingUp size={19} /><div><strong>موعد وصفقة</strong><small>المسار والقيمة ظاهران للمدير</small></div><b>جاهز</b></div>
        </div>
      </section>

      <section id="how" className="landing-section"><div className="section-heading"><span>لماذا SatışDesk؟</span><h2>تشغيل المبيعات كما يجب أن يكون</h2><p>بسيط للموظف، واضح للمدير، وآمن للمؤسسة.</p></div><div className="outcome-grid">{outcomes.map(([Icon,title,text]) => <article key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section id="pilot" className="pilot-section">
        <div><span className="hero-pill">FOUNDING PILOT</span><h2>نجهّز فريقك ونشغّل أول مسار بيع خلال أيام.</h2><p>يشمل إعداد المؤسسة، استيراد أول العملاء، تدريب الفريق، تصميم مراحل المتابعة، ودعم الإطلاق.</p></div>
        <article className="price-card"><span>الإعداد + أول شهر</span><strong>50,000 ₺</strong><small>حتى 5 مستخدمين · رسوم WhatsApp/Meta حسب الاستهلاك</small><Link className="primary-button" href="/login?mode=signup">احجز مكانك في الـPilot <ArrowLeft size={17} /></Link></article>
      </section>

      <footer className="landing-footer"><div className="logo-lockup"><span className="brand-mark">S</span><strong>SatışDesk</strong></div><p>Built for multilingual sales teams in Türkiye & MENA.</p><Link href="/login">دخول الفريق</Link></footer>
    </main>
  );
}
