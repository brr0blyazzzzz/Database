"""
create_table_users
"""

from yoyo import step

__depends__ = {}

steps = [
    step('''DROP TABLE IF EXISTS users CASCADE;DROP FUNCTION IF EXISTS check_password;'''),
    step('''CREATE TABLE public.users (
  id serial4 NOT NULL,
  login varchar(50) NOT NULL,
  "password" varchar(255) NOT NULL,
  registration_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT login CHECK (TRIM(BOTH FROM login) <> '' AND login NOT LIKE '% %' AND login ~ '^[A-Za-z0-9]+$' AND LENGTH(login) >= 6),
  CONSTRAINT password CHECK (TRIM(BOTH FROM password) <> '' AND password NOT LIKE '% %'),
  CONSTRAINT users_login_key UNIQUE (login),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

'''),
    step('''CREATE OR REPLACE FUNCTION public.check_password()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    IF LENGTH(NEW.password) < 6 THEN
        RAISE EXCEPTION 'Password must be at least 6 characters long.';
    END IF;
    IF NEW.password !~ '[0-9]' THEN
        RAISE EXCEPTION 'Password must contain at least one digit.';
    END IF;
    IF NEW.password !~ '[A-Z]' THEN
        RAISE EXCEPTION 'Password must contain at least one uppercase letter.';
    END IF;
    IF NEW.password !~ '[a-z]' THEN
        RAISE EXCEPTION 'Password must contain at least one lowercase letter.';
    END IF;
    IF NEW.password !~ '[@#$&~`!<>,.?/\\|*%]' THEN  
        RAISE EXCEPTION 'Password must contain at least one special character.';
    END IF;
    RETURN NEW;
END;
$function$;'''),
    step('''create trigger check_password_trigger before
insert
    or
update
    on
    public.users for each row execute function check_password()''')
]
