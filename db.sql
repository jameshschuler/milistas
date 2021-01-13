CREATE TABLE public.access_code
(
    access_code_id integer NOT NULL DEFAULT nextval('access_code_access_code_id_seq'::regclass),
    account_id integer NOT NULL,
    code character varying COLLATE pg_catalog."default" NOT NULL,
    expiration_date timestamp with time zone,
    created_on timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp without time zone,
    CONSTRAINT access_code_pkey PRIMARY KEY (access_code_id),
    CONSTRAINT access_code_account_id_fkey FOREIGN KEY (account_id)
        REFERENCES public.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public.list_type
(
    list_type_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp with time zone,
    CONSTRAINT list_type_pkey PRIMARY KEY (list_type_id)
);

CREATE TABLE public.list
(
    list_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    is_visible boolean NOT NULL DEFAULT true,
    list_type_id integer NOT NULL,
    account_id integer NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp with time zone,
    CONSTRAINT list_pkey PRIMARY KEY (list_id),
    CONSTRAINT list_account_id_fkey FOREIGN KEY (account_id)
        REFERENCES public.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT list_list_type_id_fkey FOREIGN KEY (list_type_id)
        REFERENCES public.list_type (list_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Seed Data
insert into list_type (type) values ('link');
insert into list_type (type) values ('text');