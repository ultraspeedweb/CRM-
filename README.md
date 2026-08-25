# SatışDesk

مركز قيادة مبيعات متعدد المؤسسات واللغات، مبني على Next.js وSupabase.

## الحالة

- نسخة الـPilot المحلية: نجح لها typecheck وlint و8 اختبارات وبناء Next.js الإنتاجي.
- قاعدة البيانات: مطبقة على مشروع Supabase `yafhipcokviboywaeyqi`.
- الأمان: RLS على جميع جداول `public`، ولا توجد صلاحيات جداول لـ`anon`.
- تسجيل الحساب وتهيئة أول مؤسسة: جاهزان.
- النشر الخارجي: الرابط الحالي هو `https://satisdesk.vercel.app`، لكن نشر تغييرات الـPilot الجديدة ينتظر موافقة رفع المصدر إلى مشروع Vercel المستقل.

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
npm test
npm run build
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` عند تشغيل نسخة جديدة. الأساس يحتاج:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

المفتاح Publishable وليس Service Role، وجميع الصلاحيات الفعلية تفرضها سياسات RLS داخل قاعدة البيانات.

تفعيل موصل WhatsApp يحتاج أيضًا المتغيرات الخادمية الموثقة في `.env.example`. لا تعمل هذه القيم في المتصفح ولا يجوز حفظ أسرارها الحقيقية في Git.

## الوحدات الموجودة

- Auth وتأكيد البريد
- تهيئة المؤسسة والعضو المالك
- الأعضاء والأدوار والفروع وسجل التدقيق
- العملاء، المصادر، التأهيل، النتيجة وسجل الأحداث
- استقبال محادثات ورسائل WhatsApp والتحقق من توقيع Webhook وحالة التسليم (الكود جاهز، التفعيل ينتظر بيانات Meta)
- الترجمة وقاموس المصطلحات
- المواعيد والمتابعات
- الصفقات ومسار المبيعات
- قواعد الأتمتة وسجل التشغيل ومنع التكرار
- التنبيهات والتقارير والإعدادات

## حدود الربط الخارجي

ربط WhatsApp Cloud API أو Instagram يحتاج بيانات Meta الفعلية (رقم الأعمال، App ID، Webhook secret). لم توضع أي بيانات وهمية أو أسرار داخل المشروع. قبل إرسال دعوات العملاء يجب إضافة `https://satisdesk.vercel.app/auth/confirm` إلى Redirect URLs وجعل Site URL هو `https://satisdesk.vercel.app` في إعدادات Supabase Auth.
