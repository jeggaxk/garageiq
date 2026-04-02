-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Garages table
create table if not exists garages (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  owner_name text,
  email text not null,
  phone text,
  address text,
  google_review_url text,
  stripe_customer_id text,
  plan text default 'trial' check (plan in ('trial', 'solo', 'pro', 'multi')),
  trial_ends_at timestamptz default (now() + interval '60 days'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers table
create table if not exists customers (
  id uuid default uuid_generate_v4() primary key,
  garage_id uuid references garages(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  vehicle_reg text,
  vehicle_make text,
  last_service_date date,
  last_mot_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  garage_id uuid references garages(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  type text not null check (type in ('mot_reminder', 'service_reminder', 'review_request', 'win_back', 'manual')),
  channel text not null check (channel in ('sms', 'email')),
  status text default 'sent' check (status in ('pending', 'sent', 'delivered', 'failed', 'opened', 'clicked')),
  content text,
  sent_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Automations table
create table if not exists automations (
  id uuid default uuid_generate_v4() primary key,
  garage_id uuid references garages(id) on delete cascade not null,
  type text not null check (type in ('mot_reminder', 'service_reminder', 'review_request', 'win_back')),
  enabled boolean default true,
  last_run_at timestamptz,
  total_sent integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(garage_id, type)
);

-- Message templates table
create table if not exists message_templates (
  id uuid default uuid_generate_v4() primary key,
  garage_id uuid references garages(id) on delete cascade not null,
  type text not null check (type in ('mot_reminder', 'service_reminder', 'review_request', 'win_back')),
  channel text not null check (channel in ('sms', 'email')),
  subject text,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(garage_id, type, channel)
);

-- Row Level Security
alter table garages enable row level security;
alter table customers enable row level security;
alter table messages enable row level security;
alter table automations enable row level security;
alter table message_templates enable row level security;

-- Garages RLS
create policy "Users can view their own garage" on garages
  for select using (owner_id = auth.uid());
create policy "Users can update their own garage" on garages
  for update using (owner_id = auth.uid());
create policy "Users can insert their own garage" on garages
  for insert with check (owner_id = auth.uid());

-- Customers RLS
create policy "Users can view their garage customers" on customers
  for select using (garage_id in (select id from garages where owner_id = auth.uid()));
create policy "Users can insert customers" on customers
  for insert with check (garage_id in (select id from garages where owner_id = auth.uid()));
create policy "Users can update customers" on customers
  for update using (garage_id in (select id from garages where owner_id = auth.uid()));
create policy "Users can delete customers" on customers
  for delete using (garage_id in (select id from garages where owner_id = auth.uid()));

-- Messages RLS
create policy "Users can view their garage messages" on messages
  for select using (garage_id in (select id from garages where owner_id = auth.uid()));
create policy "Users can insert messages" on messages
  for insert with check (garage_id in (select id from garages where owner_id = auth.uid()));

-- Automations RLS
create policy "Users can manage their automations" on automations
  for all using (garage_id in (select id from garages where owner_id = auth.uid()));

-- Message Templates RLS
create policy "Users can manage their templates" on message_templates
  for all using (garage_id in (select id from garages where owner_id = auth.uid()));

-- Indexes
create index if not exists customers_garage_id_idx on customers(garage_id);
create index if not exists customers_last_mot_date_idx on customers(last_mot_date);
create index if not exists customers_last_service_date_idx on customers(last_service_date);
create index if not exists messages_garage_id_idx on messages(garage_id);
create index if not exists messages_customer_id_idx on messages(customer_id);
create index if not exists messages_sent_at_idx on messages(sent_at);

-- Function to auto-create garage automations on new garage
create or replace function create_default_automations()
returns trigger as $$
begin
  insert into automations (garage_id, type, enabled) values
    (new.id, 'mot_reminder', true),
    (new.id, 'service_reminder', true),
    (new.id, 'review_request', true),
    (new.id, 'win_back', true);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_garage_created
  after insert on garages
  for each row execute procedure create_default_automations();

-- Function to auto-create default message templates
create or replace function create_default_templates()
returns trigger as $$
begin
  insert into message_templates (garage_id, type, channel, body) values
    (new.id, 'mot_reminder', 'sms', 'Hi [FirstName], your [VehicleReg] MOT is due in 4 weeks. Book now at [GarageName] — reply YES to confirm or call us on [GaragePhone].'),
    (new.id, 'service_reminder', 'sms', 'Hi [FirstName], it''s been almost a year since your last service at [GarageName]. Book your [VehicleMake] in now and keep it running smoothly — call [GaragePhone] or reply to this message.'),
    (new.id, 'review_request', 'sms', 'Hi [FirstName], thanks for visiting [GarageName] today. If you''re happy with the service, we''d really appreciate a quick Google review — it helps us a lot: [GoogleReviewLink]'),
    (new.id, 'win_back', 'sms', 'Hi [FirstName], we haven''t seen your [VehicleMake] in a while! Book in at [GarageName] for a free 10-point vehicle health check — call [GaragePhone] to arrange.'),
    (new.id, 'mot_reminder', 'email', 'Hi [FirstName],\n\nJust a friendly reminder that your [VehicleReg] MOT is due in 4 weeks.\n\nDon''t leave it to the last minute — book now at [GarageName] to secure your slot.\n\nGive us a call on [GaragePhone] or simply reply to this email.\n\nBest,\n[GarageName]'),
    (new.id, 'service_reminder', 'email', 'Hi [FirstName],\n\nIt''s been almost a year since your last service at [GarageName], and we wanted to make sure your [VehicleMake] stays in top condition.\n\nRegular servicing keeps your car reliable, safe, and helps maintain its value. Give us a call on [GaragePhone] to book in.\n\nBest,\n[GarageName]'),
    (new.id, 'review_request', 'email', 'Hi [FirstName],\n\nThank you for visiting [GarageName] today — we hope everything was to your satisfaction.\n\nIf you''re happy with the service, we''d be very grateful if you could leave us a quick Google review. It only takes a minute and really helps our business: [GoogleReviewLink]\n\nThank you!\n[GarageName]'),
    (new.id, 'win_back', 'email', 'Hi [FirstName],\n\nWe haven''t seen your [VehicleMake] at [GarageName] for a while, and we''d love to welcome you back.\n\nBook in for a free 10-point vehicle health check — no strings attached. Give us a call on [GaragePhone] to arrange a convenient time.\n\nHope to see you soon,\n[GarageName]');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_garage_created_templates
  after insert on garages
  for each row execute procedure create_default_templates();
