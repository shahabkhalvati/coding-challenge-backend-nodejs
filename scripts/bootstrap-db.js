const db = require('../db/pg')

db.query(`
  DROP TABLE IF EXISTS officers, reports CASCADE;

  CREATE TABLE officers (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE reports (
    ID SERIAL PRIMARY KEY,
    date_of_submit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_of_theft DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    license_number TEXT,
    color TEXT,
    type TEXT,
    owner_full_name TEXT,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    associate_officer_id INTEGER REFERENCES officers (ID)
  );

  ALTER TABLE officers
    ADD COLUMN current_case_id INTEGER UNIQUE REFERENCES reports (ID) ON DELETE CASCADE;
`)
