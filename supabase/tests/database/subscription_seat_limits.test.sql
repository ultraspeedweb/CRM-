begin;

select plan(3);

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

select function_privs_are(
  'private',
  'enforce_subscription_seat_limit',
  array[]::text[],
  'authenticated',
  array[]::text[],
  'Authenticated clients cannot execute the private seat-limit trigger function directly'
);

select * from finish();
rollback;
