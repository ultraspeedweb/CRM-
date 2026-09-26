begin;

select plan(2);

select has_function(
  'private',
  'enforce_subscription_seat_limit',
  array[]::text[],
  'Commercial seat-limit guard exists in private schema'
);

select has_trigger(
  'public',
  'organization_members',
  'organization_members_subscription_seat_limit',
  'Organization members enforce subscription seat limits'
);

select * from finish();
rollback;
