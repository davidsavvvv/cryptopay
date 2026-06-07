-- Table des marchands
create table if not exists merchants (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  wallet_address text not null,
  business_name text not null,
  created_at timestamp with time zone default now()
);

-- Table des transactions
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  merchant_username text not null references merchants(username),
  amount_eur numeric(10, 2) not null,
  amount_usdt numeric(10, 4) not null,
  fee_usdt numeric(10, 4) not null,
  status text check (status in ('completed', 'pending', 'failed')) default 'pending',
  tx_hash text,
  created_at timestamp with time zone default now()
);

-- Accès public en lecture pour les pages de paiement
alter table merchants enable row level security;
alter table transactions enable row level security;

create policy "Lecture publique des marchands"
  on merchants for select using (true);

create policy "Lecture publique des transactions"
  on transactions for select using (true);

create policy "Insertion publique des marchands"
  on merchants for insert with check (true);

create policy "Insertion publique des transactions"
  on transactions for insert with check (true);

create policy "Mise à jour des marchands"
  on merchants for update using (true);
