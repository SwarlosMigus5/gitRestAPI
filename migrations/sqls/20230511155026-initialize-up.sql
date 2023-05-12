-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(    
    "userName" character varying(50) COLLATE pg_catalog."default",
    "userLocation" character varying(50) COLLATE pg_catalog."default",
    "progLanguages" character varying(200) COLLATE pg_catalog."default",
    "userBio" character varying(75) COLLATE pg_catalog."default",
    "userLogin" character varying(50) COLLATE pg_catalog."default",
    "userEmail" character varying(50) COLLATE pg_catalog."default",
    "userTwitter" character varying(50) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;