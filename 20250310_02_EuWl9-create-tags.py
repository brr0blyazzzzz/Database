"""
create_tags
"""

from yoyo import step

__depends__ = {}

steps = [
    step("""DROP TABLE IF EXISTS public.tags CASCADE"""),
    step("""
    CREATE TABLE public.tags (
        id serial4 NOT NULL,
        title varchar(50) NOT NULL,
        CONSTRAINT tags_pkey PRIMARY KEY (id),
        CONSTRAINT unique_title UNIQUE (title));"""),
    step("""
    INSERT INTO public.tags (title) VALUES
        ('Good'),
        ('Average'),
        ('Excellent'),
        ('Satisfactory'),
        ('Unsatisfactory'),
        ('Bad');
        """)
]
