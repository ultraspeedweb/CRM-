# SatışDesk

مركز قيادة مبيعات متعدد المؤسسات واللغات، مبني على Next.js وSupabase.

## الحالة

- واجهة الإنتاج: جاهزة، ونجح `npm run build`.
- قاعدة البيانات: مطبقة على مشروع Supabase `yafhipcokviboywaeyqi`.
- الأمان: RLS على جميع جداول `public`، ولا توجد صلاحيات جداول لـ`anon`.
- تسجيل الحساب وتهيئة أول مؤسسة: جاهزان.
- النشر الخارجي: Production جاهز على `https://satisdesk.vercel.app` ضمن المشروع المستقل `ultrablueais-projects/satisdesk`.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح `http://localhost:3000`.

## فحوص الجودة

```bash
npm run typecheck
npm run lint
npm run build
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` عند تشغيل نسخة جديدة. المشروع يحتاج فقط:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

المفتاح Publishable وليس Service Role، وجميع الصلاحيات الفعلية تفرضها سياسات RLS داخل قاعدة البيانات.

## الوحدات الموجودة

- Auth وتأكيد البريد
- تهيئة المؤسسة والعضو المالك
- الأعضاء والأدوار والفروع وسجل التدقيق
- العملاء، المصادر، التأهيل، النتيجة وسجل الأحداث
- المحادثات والرسائل وحالة التسليم
- الترجمة وقاموس المصطلحات
- المواعيد والمتابعات
- الصفقات ومسار المبيعات
- قواعد الأتمتة وسجل التشغيل ومنع التكرار
- التنبيهات والتقارير والإعدادات

## حدود الربط الخارجي

ربط WhatsApp Cloud API أو Instagram يحتاج بيانات Meta الفعلية (رقم الأعمال، App ID، Webhook secret). لم توضع أي بيانات وهمية أو أسرار داخل المشروع. قبل إرسال دعوات العملاء يجب إضافة `https://satisdesk.vercel.app/auth/confirm` إلى Redirect URLs وجعل Site URL هو `https://satisdesk.vercel.app` في إعدادات Supabase Auth.
