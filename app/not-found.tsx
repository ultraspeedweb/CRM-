import Link from "next/link";

export default function NotFound() {
  return <main className="center-page"><section className="auth-card"><div className="brand-mark">S</div><h1>الصفحة غير موجودة</h1><Link className="primary-button" href="/dashboard">العودة للوحة التحكم</Link></section></main>;
}
