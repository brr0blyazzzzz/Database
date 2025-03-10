"""
create_table_accounts
"""

from yoyo import step

__depends__ = {}

steps = [
    step('''DROP TABLE IF EXISTS accounts CASCADE;'''),
    step('''CREATE TABLE public.accounts (
  user_id int4 NOT NULL,
  "family" varchar(50) NOT NULL,
  "name" varchar(50) NOT NULL,
  patronymic varchar(50) NULL,
  birth_date date NOT NULL,
  CONSTRAINT accounts_pkey PRIMARY KEY (user_id),
  CONSTRAINT birth_date_check CHECK (birth_date >= CURRENT_DATE - INTERVAL '130 years' AND birth_date <= CURRENT_DATE - INTERVAL '1 month'),
  CONSTRAINT family CHECK (family IS NOT NULL AND TRIM(BOTH FROM family) <> '' AND family ~ '^[A-Za-z]+[-A-Za-z]*[A-Za-z]$' AND family !~ '^-+$'),
  CONSTRAINT name CHECK (name IS NOT NULL AND TRIM(BOTH FROM name) <> '' AND name ~ '^[A-Za-z]+[-A-Za-z]*[A-Za-z]$' AND name !~ '^-+$'),
  CONSTRAINT patronymic CHECK (patronymic IS NULL OR TRIM(BOTH FROM patronymic) = '' OR (patronymic ~ '^[A-Za-z]+[-A-Za-z]*[A-Za-z]$' AND patronymic !~ '^-+$')),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE);
''')
]
