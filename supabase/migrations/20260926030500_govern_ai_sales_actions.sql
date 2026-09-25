begin;

-- AI suggestions are proposals. Agents may create drafts, but approval/rejection is a manager action.
drop policy if exists ai_suggestions_staff_update on public.ai_suggestions;
create policy ai_suggestions_manager_update
  on public.ai_suggestions for update to authenticated
  using (private.has_org_role(organization_id, array['owner','admin','manager']))
  with check (private.has_org_role(organization_id, array['owner','admin','manager']));

-- Human handoff is allowed for staff; returning a conversation to autonomous AI is manager-governed.
create or replace function public.resume_conversation_ai(p_conversation_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = public, private
as $$
declare
  v_org uuid;
begin
  select organization_id into v_org
  from public.conversations
  where id = p_conversation_id
    and private.is_org_member(organization_id);

  if v_org is null or not private.has_org_role(v_org, array['owner','admin','manager']) then
    raise exception 'not authorized';
  end if;

  update public.conversations
  set handling_mode = 'ai', handoff_reason = null, handoff_at = null, handoff_by = null
  where id = p_conversation_id
    and organization_id = v_org
    and handling_mode = 'human';

  return found;
end;
$$;
revoke all on function public.resume_conversation_ai(uuid) from public, anon;
grant execute on function public.resume_conversation_ai(uuid) to authenticated;

commit;
