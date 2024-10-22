SET ROLE subscription;

CREATE TYPE genders AS ENUM ('male', 'female');

CREATE TABLE subscriptions (
  subscription_id uuid NOT NULL,
  email text NOT NULL,
  newsletter_id text NOT NULL,

  first_name text,
  gender genders,
  date_of_birth date NOT NULL,
  consent_flag bool NOT NULL,

  PRIMARY KEY (email, newsletter_id)
);

CREATE UNIQUE INDEX subscription_id_unique ON subscriptions (subscription_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON subscriptions TO "subscription-worker";
