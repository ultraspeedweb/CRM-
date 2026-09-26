begin;

create or replace function public.execute_approved_ai_suggestion(p_organization_id uuid,p_suggestion_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_suggestion public.ai_suggestions%rowtype;
  v_message_id uuid;
begin
  if v_actor is null then raise exception 'authentication required'; end if;
  if not private.has_org_role(p_organization_id,array['owner','admin','manager']) then raise exception 'insufficient role'; end if;

  select * into v_suggestion from public.ai_suggestions
  where organization_id=p_organization_id and id=p_suggestion_id for update;
  if not found then raise exception 'suggestion not found'; end if;
  if v_suggestion.status<>'approved' or v_suggestion.approved_by is null or v_suggestion.approved_at is null then raise exception 'suggestion is not approved'; end if;
  if v_suggestion.suggestion_type<>'sales_reply' or nullif(btrim(v_suggestion.suggested_reply),'') is null then raise exception 'suggestion is not executable'; end if;

  insert into public.messages(organization_id,conversation_id,direction,body,status)
  values(p_organization_id,v_suggestion.conversation_id,'outbound',v_suggestion.suggested_reply,'pending')
  returning id into v_message_id;

  update public.ai_suggestions set status='sent'
  where organization_id=p_organization_id and id=p_suggestion_id and status='approved';
  if not found then raise exception 'suggestion state changed'; end if;

  insert into public.audit_logs(organization_id,actor_user_id,action,entity_type,entity_id,metadata)
  values(p_organization_id,v_actor,'ai.suggestion.executed','ai_suggestion',p_suggestion_id,
    jsonb_build_object('message_id',v_message_id,'conversation_id',v_suggestion.conversation_id,'approved_by',v_suggestion.approved_by,'suggestion_type',v_suggestion.suggestion_type));
  return v_message_id;
end;
$$;

revoke all on function public.execute_approved_ai_suggestion(uuid,uuid) from public,anon;
grant execute on function public.execute_approved_ai_suggestion(uuid,uuid) to authenticated;

commit;
