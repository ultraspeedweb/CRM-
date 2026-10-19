-- Audit who moved a commercial intake into review; no payment or subscription mutation.
alter table public.commercial_activation_requests
  add column reviewed_by uuid references auth.users(id),
  add column reviewed_at timestamptz;
alter table public.commercial_activation_requests
  add constraint commercial_activation_review_pair check (
    (reviewed_by is null and reviewed_at is null) or
    (reviewed_by is not null and reviewed_at is not null)
  );
create index commercial_activation_review_actor_idx
  on public.commercial_activation_requests(reviewed_by) where reviewed_by is not null;
