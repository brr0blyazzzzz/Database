# -*- coding: utf-8 -*-
from yoyo import step

depends = {}

steps = [
    step('''DROP PROCEDURE IF EXISTS register_user(text, text, text, text, text, date);'''),
    step('''
    CREATE OR REPLACE PROCEDURE public.register_user(
        IN p_login text, 
        IN p_password text, 
        IN p_family text, 
        IN p_name text, 
        IN p_patronymic text, 
        IN p_birth_date date
    ) 
    LANGUAGE plpgsql
    AS $procedure$
    DECLARE
        user_id INTEGER;
    BEGIN
        INSERT INTO users (login, password) 
        VALUES (LOWER(TRIM(p_login)), TRIM(p_password)) 
        RETURNING id INTO user_id;
        INSERT INTO accounts (user_id, family, name, patronymic, birth_date) 
        VALUES (user_id, INITCAP(TRIM(p_family)), INITCAP(TRIM(p_name)), INITCAP(TRIM(p_patronymic)), p_birth_date);
    EXCEPTION
        WHEN unique_violation THEN 
            RAISE EXCEPTION 'Login "%", already exists.', LOWER(TRIM(p_login)); 
            ROLLBACK;
        WHEN check_violation THEN
            IF SQLERRM LIKE '%birth_date%' THEN
                RAISE EXCEPTION 'You cannot be older than 130 years or younger than 1 month. Please try again.';
                ROLLBACK;
            ELSIF SQLERRM LIKE '%family%' THEN
                RAISE EXCEPTION 'Family cannot be empty and must consist of letters.';
                ROLLBACK;
            ELSIF SQLERRM LIKE '%name%' THEN
                RAISE EXCEPTION 'Name cannot be empty and must consist of letters.';
                ROLLBACK;
            ELSIF SQLERRM LIKE '%patronymic%' THEN
                RAISE EXCEPTION 'If you have a patronymic, it must consist of letters.';
                ROLLBACK;
            ELSIF SQLERRM LIKE '%login%' THEN
                RAISE EXCEPTION 'Login cannot be empty and must consist of letters or digits and the minimum length 
                is 6 characters.';
                ROLLBACK;
            ELSE
                RAISE EXCEPTION '%', SQLERRM;
                ROLLBACK;
            END IF;
        WHEN OTHERS THEN
             RAISE EXCEPTION '%', SQLERRM;
            ROLLBACK;
        COMMIT;
    END $procedure$;
    ''')
]
