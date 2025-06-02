This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Next things:
[Boilerplate to check with](https://www.ory.sh/blog/enterprise-ready-saas-starter-kit)
- [ ] Sign in with Google OAuth
- [ ] Sign in with Facebook 
- [ ] Webhooks and Events
- [ ] Audit logs
- [ ] Internationalization


## DB
### Pulse

```create table public.pulse (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default now(),
  focus_level integer not null check (focus_level >= 1 and focus_level <= 5),
  activity text not null,
  tag text
);

alter table public.pulse enable row level security;

create policy "Allow user to access own pulses"
  on public.pulse
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

```

### Tracking
```
create table public.tracking_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  description text not null,
  created_at timestamp with time zone default now()
);

alter table public.tracking_entries enable row level security;

create policy "Users can access their own tracking entries"
  on public.tracking_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

```