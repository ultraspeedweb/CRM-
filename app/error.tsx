"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="center-page">
      <section className="auth-card">
        <div className="brand-mark">S</div>
        <h1>صار خطأ غير متوقع</h1>
        <p className="muted">بياناتك آمنة. جرّب إعادة تحميل القسم.</p>
        <button className="primary-button" onClick={reset}>إعادة المحاولة</button>
      </section>
    </main>
  );
}
