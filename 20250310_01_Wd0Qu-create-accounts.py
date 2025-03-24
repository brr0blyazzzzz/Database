"""
create_accounts
"""

from yoyo import step

__depends__ = {}

steps = [
    step("""DROP TABLE IF EXISTS public.accounts CASCADE"""),
    step("""CREATE TABLE public.accounts (
  id serial4 NOT NULL,
  family varchar(50) NOT NULL,
  name varchar(50) NOT NULL,
  patronymic varchar(50) NULL,
  birth_date date NOT NULL,
  tags _int4 NULL,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT birth_date_check CHECK (birth_date >= CURRENT_DATE - INTERVAL '130 years' AND birth_date <= CURRENT_DATE - INTERVAL '1 month'),
  CONSTRAINT family CHECK (family IS NOT NULL AND TRIM(BOTH FROM family) <> '' AND family ~ '^(?!-)[A-Za-z]{1}(?:[A-Za-z]+(?<!-)|[A-Za-z]{1})*$' AND family !~ '^-+$'),
  CONSTRAINT name CHECK (name IS NOT NULL AND TRIM(BOTH FROM name) <> '' AND name ~ '^(?!-)[A-Za-z]{1}(?:[A-Za-z]+(?<!-)|[A-Za-z]{1})*$' AND name !~ '^-+$'),
  CONSTRAINT patronymic CHECK (patronymic IS NULL OR TRIM(BOTH FROM patronymic) = '' OR (patronymic ~ '^(?!-)[A-Za-z]{1}(?:[A-Za-z]+(?<!-)|[A-Za-z]{1})*$' AND patronymic !~ '^-+$')));
    """),
    step("""
   INSERT INTO public.accounts (family, name, patronymic, birth_date, tags) VALUES
       ('Pugacheva', 'Alla', 'Borisovna', '1964-09-08', '{5,6}'),
       ('Putin', 'Vladimir', 'Vladimirovich', '2020-08-07', '{1,3}'),
       ('Alexeeva', 'Alena', 'Vladimirovna', '2005-08-09', '{2,5}'),
       ('Boika', 'Mia', NULL, '1994-12-14', '{1,6,4}'),
       ('Satoru', 'Gojo', NULL, '1900-10-23', '{1,2,3,4,5,6}'),
       ('Shishmarev', 'Alexander', 'Evgenievich', '1982-09-12', '{5,6,3}'),
       ('Ivanov', 'Ivan', 'Ivanovich', '1990-07-26', '{1,2,4,6}');
   """)
]
