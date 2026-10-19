import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const email = "launch-e2e@example.test";
const password = "LaunchPass12345";
const ownerName = "Launch E2E Owner";
const orgName = "Launch E2E Organization";
const orgSlug = "launch-e2e";
const leadName = "Launch E2E Lead";
function istanbulLocalDateTime(daysAhead){const date=new Date(Date.now()+daysAhead*86400000);return new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(date).replace(" ","T");}
async function submit(page,form){await Promise.all([page.waitForLoadState("networkidle"),form.locator('button[type="submit"]').click()]);}

test("commercial launch flow works UI to DB",async({page})=>{
 await page.goto(`${baseURL}/login?mode=signup`); await page.locator('input[name="fullName"]').fill(ownerName); await page.locator('input[name="email"]').fill(email); await page.locator('input[name="password"]').fill(password); await submit(page,page.locator("form.stack-form")); await expect(page).toHaveURL(/\/onboarding/);
 await expect(page.locator('input[name="name"]')).toHaveValue(""); await expect(page.locator('input[name="slug"]')).toHaveValue("");
 await page.locator('input[name="fullName"]').fill(ownerName); await page.locator('input[name="name"]').fill(orgName); await page.locator('input[name="slug"]').fill(orgSlug); await submit(page,page.locator("form.stack-form")); await expect(page).toHaveURL(/\/getting-started/); await expect(page.locator('main a[href="/leads"]').first()).toBeVisible();
 await page.goto(`${baseURL}/platform`); await expect(page).toHaveURL(/\/dashboard/); // Tenant owner is not Platform Owner.
 const exportDenied=await page.request.get(`${baseURL}/platform/export`,{maxRedirects:0}); expect(exportDenied.status()).toBe(403);
 // Operational launch acceptance must cover the product beyond billing and CRM.
 for (const route of ["/dashboard","/conversations","/automation","/notifications","/reports"]) {
  await page.goto(`${baseURL}${route}`);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
 }
 await page.goto(`${baseURL}/settings`); await expect(page.locator("main")).toBeVisible();
 await expect(page.locator('a[href="/getting-started"]')).toBeVisible();
 await page.locator('a[href="/getting-started"]').click();
 await expect(page).toHaveURL(/\/getting-started/);
 await expect(page.locator('main a[href="/leads"]').first()).toBeVisible();
 await expect(page.locator('main a[href="/deals"]').first()).toBeVisible();
 await expect(page.locator('main a[href="/follow-ups"]').first()).toBeVisible();
 await expect(page.locator('main a[href="/subscription"]').first()).toBeVisible(); await page.goto(`${baseURL}/subscription`); await expect(page.locator('main')).toContainText(/No activated commercial subscription|لا توجد باقة تجارية|henüz bulunmuyor/);
 await page.locator('form[action] input[name="email"]').first().fill("commercial-e2e@example.test");
 await page.locator('form[action] select[name="plan"]').selectOption("growth");
 await page.locator('form[action] textarea[name="notes"]').fill("Request a written commercial quote");
 await submit(page,page.locator('form').filter({has:page.locator('select[name="plan"]')}));
 await expect(page).toHaveURL(/result=submitted/);
 await expect(page.locator("main")).toContainText("growth");
 await expect(page.locator('form select[name="plan"]')).toHaveCount(0);
 await page.goto(`${baseURL}/leads`); await page.locator('input[name="fullName"]').fill(leadName); await page.locator('input[name="phone"]').fill("+905551112233"); await page.locator('input[name="email"]').fill("lead-e2e@example.test"); await page.locator('select[name="sourceChannel"]').selectOption("manual"); await submit(page,page.locator("form.stack-form")); await expect(page.getByText(leadName)).toBeVisible();
 await page.goto(`${baseURL}/follow-ups`); await page.locator('select[name="leadId"]').selectOption({label:leadName}); await page.locator('input[name="subject"]').fill("Launch E2E follow-up"); await page.locator('input[name="dueAt"]').fill(istanbulLocalDateTime(1)); await submit(page,page.locator("form.stack-form")); const followUpRow=page.locator(".task-row").filter({hasText:"Launch E2E follow-up"}); await expect(followUpRow).toBeVisible(); const doneForm=followUpRow.locator("form").filter({has:page.getByRole("button",{name:"Done"})}); await submit(page,doneForm); await expect(followUpRow).toHaveCount(0);
 await page.goto(`${baseURL}/appointments`); await page.locator('select[name="leadId"]').selectOption({label:leadName}); await page.locator('input[name="title"]').fill("Launch E2E Completed Appointment"); await page.locator('input[name="startsAt"]').fill(istanbulLocalDateTime(2)); await page.locator('input[name="location"]').fill("E2E Office"); await submit(page,page.locator("article.form-panel form")); let appointmentRow=page.locator(".appointment-row").filter({hasText:"Launch E2E Completed Appointment"}); await expect(appointmentRow).toBeVisible(); await appointmentRow.locator('select[name="status"]').selectOption("confirmed"); await submit(page,appointmentRow.locator("form")); appointmentRow=page.locator(".appointment-row").filter({hasText:"Launch E2E Completed Appointment"}); await expect(appointmentRow.locator('select[name="status"]')).toHaveValue("confirmed"); await appointmentRow.locator('select[name="status"]').selectOption("completed"); await submit(page,appointmentRow.locator("form")); appointmentRow=page.locator(".appointment-row").filter({hasText:"Launch E2E Completed Appointment"}); await expect(appointmentRow.locator("form")).toHaveCount(0);
 await page.locator('select[name="leadId"]').selectOption({label:leadName}); await page.locator('input[name="title"]').fill("Launch E2E Cancelled Appointment"); await page.locator('input[name="startsAt"]').fill(istanbulLocalDateTime(3)); await submit(page,page.locator("article.form-panel form")); let cancelledRow=page.locator(".appointment-row").filter({hasText:"Launch E2E Cancelled Appointment"}); await cancelledRow.locator('select[name="status"]').selectOption("cancelled"); await cancelledRow.locator('input[name="cancellationReason"]').fill("E2E customer cancellation"); await submit(page,cancelledRow.locator("form")); cancelledRow=page.locator(".appointment-row").filter({hasText:"Launch E2E Cancelled Appointment"}); await expect(cancelledRow).toContainText("E2E customer cancellation"); await expect(cancelledRow.locator("form")).toHaveCount(0);
 await page.goto(`${baseURL}/deals`); const createDeal=page.locator("section.deal-create form"); await createDeal.locator('select[name="leadId"]').selectOption({label:leadName}); await createDeal.locator('input[name="title"]').fill("Launch E2E Won Deal"); await createDeal.locator('input[name="amount"]').fill("50000"); await createDeal.locator('select[name="currency"]').selectOption("TRY"); await createDeal.locator('input[name="probability"]').fill("20"); await createDeal.locator('input[name="nextAction"]').fill("Review proposal"); await createDeal.locator('input[name="nextActionAt"]').fill(istanbulLocalDateTime(1)); await submit(page,createDeal); let wonCard=page.locator(".deal-card").filter({hasText:"Launch E2E Won Deal"}); for(const [stage,probability] of [["proposal","40"],["negotiation","75"]]){await wonCard.locator('select[name="stage"]').selectOption(stage);await wonCard.locator('input[name="probability"]').fill(probability);await submit(page,wonCard.locator('form:has(select[name="stage"])'));wonCard=page.locator(".deal-card").filter({hasText:"Launch E2E Won Deal"});} await wonCard.locator('select[name="stage"]').selectOption("won"); await submit(page,wonCard.locator('form:has(select[name="stage"])')); wonCard=page.locator(".deal-card").filter({hasText:"Launch E2E Won Deal"}); await expect(wonCard.locator('form:has(select[name="stage"])')).toHaveCount(0); await expect(wonCard).toContainText("100%");
 const createLostDeal=page.locator("section.deal-create form"); await createLostDeal.locator('select[name="leadId"]').selectOption({label:leadName}); await createLostDeal.locator('input[name="title"]').fill("Launch E2E Lost Deal"); await createLostDeal.locator('input[name="amount"]').fill("12000"); await createLostDeal.locator('select[name="currency"]').selectOption("TRY"); await createLostDeal.locator('input[name="probability"]').fill("20"); await createLostDeal.locator('input[name="nextAction"]').fill("Call customer"); await createLostDeal.locator('input[name="nextActionAt"]').fill(istanbulLocalDateTime(1)); await submit(page,createLostDeal); let lostCard=page.locator(".deal-card").filter({hasText:"Launch E2E Lost Deal"}); await lostCard.locator('select[name="stage"]').selectOption("lost"); await lostCard.locator('input[name="lostReason"]').fill("E2E customer chose another provider"); await submit(page,lostCard.locator('form:has(select[name="stage"])')); lostCard=page.locator(".deal-card").filter({hasText:"Launch E2E Lost Deal"}); await expect(lostCard.locator('form:has(select[name="stage"])')).toHaveCount(0); await expect(lostCard).toContainText("0%"); await expect(lostCard).toContainText("E2E customer chose another provider");
 await page.goto(`${baseURL}/getting-started`); await expect(page.locator("main")).toBeVisible();
 for (const href of ["/leads", "/deals", "/follow-ups"]) { const row = page.locator(`main a[href="${href}"]`).first().locator(".."); await expect(row).toContainText(/Completed|Tamamlandı|مكتمل/); }
 await page.goto(`${baseURL}/dashboard`); await submit(page,page.locator(".sidebar-bottom form")); await expect(page).toHaveURL(/\/login/); await page.goto(`${baseURL}/subscription`); await expect(page).toHaveURL(/\/login/); await page.locator('input[name="email"]').fill(email); await page.locator('input[name="password"]').fill(password); await submit(page,page.locator("form.stack-form")); await expect(page).toHaveURL(/\/dashboard/);
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,secretKey=process.env.SUPABASE_SECRET_KEY; expect(supabaseUrl).toBeTruthy();expect(secretKey).toBeTruthy(); const admin=createClient(supabaseUrl,secretKey,{auth:{persistSession:false}}); const {data:org,error:orgError}=await admin.from("organizations").select("id").eq("slug",orgSlug).single();expect(orgError).toBeNull();expect(org?.id).toBeTruthy(); const {data:activation,error:activationError}=await admin.from("commercial_activation_requests").select("desired_plan,contact_email,notes,status,requested_by").eq("organization_id",org.id).single(); const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 expect(publicKey).toBeTruthy();
 const tenantClient=createClient(supabaseUrl,publicKey,{auth:{persistSession:false}});
 const {error:tenantLoginError}=await tenantClient.auth.signInWithPassword({email,password});
 expect(tenantLoginError).toBeNull();
 const {data:illegalReview,error:illegalReviewError}=await tenantClient.rpc("begin_commercial_activation_review",{p_request_id:(await admin.from("commercial_activation_requests").select("id").eq("organization_id",org.id).single()).data.id});
 expect(illegalReview).toBeNull();
 expect(illegalReviewError).not.toBeNull(); const {data:illegalProposal,error:illegalProposalError}=await tenantClient.rpc("create_commercial_proposal_draft",{p_request_id:(await admin.from("commercial_activation_requests").select("id").eq("organization_id",org.id).single()).data.id,p_amount_minor:50000,p_currency:"TRY",p_scope:"This unauthorized user cannot issue any proposal",p_valid_until:"2027-01-01"}); expect(illegalProposal).toBeNull(); expect(illegalProposalError).not.toBeNull();
 const quoteUntil=new Date(Date.now()+14*86400000).toISOString().slice(0,10);
 const {data:sampleOffer,error:offerSeedError}=await admin.from("commercial_proposals").insert({
  request_id:(await admin.from("commercial_activation_requests").select("id").eq("organization_id",org.id).single()).data.id,
  organization_id:org.id,amount_minor:250000,currency:"TRY",scope:"Business pilot subscription proposal for customer acceptance testing.",
  valid_until:quoteUntil,state:"published",created_by:activation.requested_by,published_by:activation.requested_by,published_at:new Date().toISOString()
 }).select("id").single();
 expect(offerSeedError).toBeNull();
 const {data:visibleOffer,error:offerReadError}=await tenantClient.from("commercial_proposals").select("id,state").eq("organization_id",org.id);
 expect(offerReadError).toBeNull();expect(visibleOffer).toEqual([expect.objectContaining({id:sampleOffer.id,state:"published"})]);
 const {data:acknowledged,error:ackError}=await tenantClient.rpc("accept_commercial_proposal",{p_proposal_id:sampleOffer.id});
 expect(ackError).toBeNull();expect(acknowledged).toBe(true);
 const {data:acceptedOffer}=await admin.from("commercial_proposals").select("state,accepted_by,accepted_at").eq("id",sampleOffer.id).single();
 expect(acceptedOffer.state).toBe("accepted");expect(acceptedOffer.accepted_by).toBe(activation.requested_by);expect(acceptedOffer.accepted_at).toBeTruthy();
 const {data:repeatAcknowledgement}=await tenantClient.rpc("accept_commercial_proposal",{p_proposal_id:sampleOffer.id});
 expect(repeatAcknowledgement).toBe(false);

 expect(activationError).toBeNull(); expect(activation).toMatchObject({desired_plan:"growth",contact_email:"commercial-e2e@example.test",notes:"Request a written commercial quote",status:"submitted"}); const {error:duplicateRequestError}=await admin.from("commercial_activation_requests").insert({organization_id:org.id,requested_by:activation.requested_by,contact_email:"duplicate@example.test",desired_plan:"starter",notes:"attempted duplicate"}); expect(duplicateRequestError?.code).toBe("23505"); const {data:billingRecords}=await admin.from("organization_subscriptions").select("id").eq("organization_id",org.id); expect(billingRecords??[]).toHaveLength(0); const {data:lead,error:leadError}=await admin.from("leads").select("id,status").eq("organization_id",org.id).eq("full_name",leadName).single();expect(leadError).toBeNull();expect(lead?.id).toBeTruthy(); const {data:wonDeal}=await admin.from("deals").select("stage,probability,closed_at").eq("organization_id",org.id).eq("title","Launch E2E Won Deal").single();expect(wonDeal?.stage).toBe("won");expect(Number(wonDeal?.probability)).toBe(100);expect(wonDeal?.closed_at).toBeTruthy(); const {data:lostDeal}=await admin.from("deals").select("stage,probability,lost_reason,closed_at").eq("organization_id",org.id).eq("title","Launch E2E Lost Deal").single();expect(lostDeal?.stage).toBe("lost");expect(Number(lostDeal?.probability)).toBe(0);expect(lostDeal?.lost_reason).toBe("E2E customer chose another provider");expect(lostDeal?.closed_at).toBeTruthy(); const {data:completedAppointment}=await admin.from("appointments").select("status").eq("organization_id",org.id).eq("title","Launch E2E Completed Appointment").single();expect(completedAppointment?.status).toBe("completed"); const {data:cancelledAppointment}=await admin.from("appointments").select("status,cancellation_reason").eq("organization_id",org.id).eq("title","Launch E2E Cancelled Appointment").single();expect(cancelledAppointment?.status).toBe("cancelled");expect(cancelledAppointment?.cancellation_reason).toBe("E2E customer cancellation"); const {data:followUp}=await admin.from("follow_ups").select("status,completed_at").eq("organization_id",org.id).eq("subject","Launch E2E follow-up").single();expect(followUp?.status).toBe("completed");expect(followUp?.completed_at).toBeTruthy();
});

test("public buyer journey reaches the pilot offer and signup without premature checkout",async({page})=>{
 await page.goto(baseURL);
 await expect(page.locator('a[href="/pilot"]').first()).toBeVisible();
 await page.locator('a[href="/pilot"]').first().click();
 await expect(page).toHaveURL(/\/pilot$/);
 await expect(page.locator('main')).toContainText(/50[,.]000|50,000/);
 await expect(page.locator('main')).toContainText(/Meta/i);
 await expect(page.locator('a[href="/login?mode=signup"]').first()).toBeVisible();
 await page.locator('a[href="/login?mode=signup"]').first().click();
 await expect(page).toHaveURL(/\/login\?mode=signup/);
 await expect(page.locator('input[name="fullName"]')).toBeVisible();
 await page.goto(`${baseURL}/pricing`);
 await expect(page.locator('a[href="/pilot"]').first()).toBeVisible();
 await expect(page.locator('a[href="/login?mode=signup"]')).toHaveCount(0);
});
