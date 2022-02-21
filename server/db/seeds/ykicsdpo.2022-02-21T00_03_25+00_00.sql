--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: labber
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO labber;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: dict_int; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_int WITH SCHEMA public;


--
-- Name: EXTENSION dict_int; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION dict_int IS 'text search dictionary template for integers';


--
-- Name: dict_xsyn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_xsyn WITH SCHEMA public;


--
-- Name: EXTENSION dict_xsyn; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION dict_xsyn IS 'text search dictionary template for extended synonym processing';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgrowlocks; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrowlocks WITH SCHEMA public;


--
-- Name: EXTENSION pgrowlocks; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgrowlocks IS 'show row-level locking information';


--
-- Name: pgstattuple; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgstattuple WITH SCHEMA public;


--
-- Name: EXTENSION pgstattuple; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgstattuple IS 'show tuple-level statistics';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: xml2; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS xml2 WITH SCHEMA public;


--
-- Name: EXTENSION xml2; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION xml2 IS 'XPath querying and XSLT';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bet_slip; Type: TABLE; Schema: public; Owner: labber
--

CREATE TABLE public.bet_slip (
    id character varying NOT NULL,
    user_id character varying,
    amount_wagered real NOT NULL,
    potential_payout real NOT NULL,
    created_on timestamp without time zone NOT NULL,
    win boolean
);


ALTER TABLE public.bet_slip OWNER TO labber;

--
-- Name: games; Type: TABLE; Schema: public; Owner: labber
--

CREATE TABLE public.games (
    id integer NOT NULL,
    teams_playing character varying
);


ALTER TABLE public.games OWNER TO labber;

--
-- Name: single_bet; Type: TABLE; Schema: public; Owner: labber
--

CREATE TABLE public.single_bet (
    id integer NOT NULL,
    bet_slip_id character varying,
    game_id integer,
    odds real NOT NULL,
    spread real,
    total real,
    bet_on_home boolean,
    bet_on_away boolean,
    bet_on_over boolean,
    bet_on_under boolean,
    win boolean
);


ALTER TABLE public.single_bet OWNER TO labber;

--
-- Name: single_bet_id_seq; Type: SEQUENCE; Schema: public; Owner: labber
--

CREATE SEQUENCE public.single_bet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.single_bet_id_seq OWNER TO labber;

--
-- Name: single_bet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: labber
--

ALTER SEQUENCE public.single_bet_id_seq OWNED BY public.single_bet.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: labber
--

CREATE TABLE public.users (
    id character varying(350) NOT NULL,
    name character varying(50) NOT NULL,
    picture character varying(350),
    email character varying(255) NOT NULL,
    balance real DEFAULT 4000,
    nickname character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO labber;

--
-- Name: single_bet id; Type: DEFAULT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.single_bet ALTER COLUMN id SET DEFAULT nextval('public.single_bet_id_seq'::regclass);


--
-- Data for Name: bet_slip; Type: TABLE DATA; Schema: public; Owner: labber
--

COPY public.bet_slip (id, user_id, amount_wagered, potential_payout, created_on, win) FROM stdin;
28665ff9a1c8b3ea65a8c347e9d3409514e4c4c9	google-oauth2|109718030698161816021	100	545.94	2022-02-20 23:34:32.881449	\N
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: labber
--

COPY public.games (id, teams_playing) FROM stdin;
278845	Montreal Canadiens vs New York Islanders
278844	Carolina Hurricanes @ Pittsburgh Penguins
\.


--
-- Data for Name: single_bet; Type: TABLE DATA; Schema: public; Owner: labber
--

COPY public.single_bet (id, bet_slip_id, game_id, odds, spread, total, bet_on_home, bet_on_away, bet_on_over, bet_on_under, win) FROM stdin;
115	28665ff9a1c8b3ea65a8c347e9d3409514e4c4c9	278844	-131	\N	\N	t	\N	\N	\N	f
114	28665ff9a1c8b3ea65a8c347e9d3409514e4c4c9	278845	244	\N	\N	\N	t	\N	\N	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: labber
--

COPY public.users (id, name, picture, email, balance, nickname) FROM stdin;
google-oauth2|109718030698161816021	Alula Leakemariam	https://lh3.googleusercontent.com/a-/AOh14Gh85TCQWEupUrEmEjbhYDoBJq4S2o2RHFn9mAcR=s96-c	alula.leakemariam94@gmail.com	1254.605	alula.leakemariam94
google-oauth2|111690869041779100174	Rahwa Leakemariam	https://lh3.googleusercontent.com/a-/AOh14GiYGPw1e9mMZhK9DMK9jRuRHaSFRXtgAN574Eyz6A=s96-c	rah.leak@gmail.com	3700	rah.leak
\.


--
-- Name: single_bet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: labber
--

SELECT pg_catalog.setval('public.single_bet_id_seq', 115, true);


--
-- Name: bet_slip bet_slip_pkey; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.bet_slip
    ADD CONSTRAINT bet_slip_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: single_bet single_bet_pkey; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.single_bet
    ADD CONSTRAINT single_bet_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_name_key; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);


--
-- Name: users users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nickname_key UNIQUE (nickname);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bet_slip bet_slip_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.bet_slip
    ADD CONSTRAINT bet_slip_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: single_bet single_bet_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: labber
--

ALTER TABLE ONLY public.single_bet
    ADD CONSTRAINT single_bet_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- PostgreSQL database dump complete
--

