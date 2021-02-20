-- Reset the table
truncate table covid_19_new_zealand;

-- Reset the ID sequence
alter sequence covid_19_new_zealand_id_seq restart with 1;
update covid_19_new_zealand
set id=nextval('covid_19_new_zealand_id_seq');

-- Set the date style
alter database micado set datestyle to "ISO, DMY";

-- Import
copy covid_19_new_zealand (class,
                           category,
                           indicator_name,
                           series_name,
                           sub_series_name,
                           parameter,
                           value,
                           units,
                           date_last_updated) from '/Users/roc/Projects/micado-code-challenge/covid_19.valid.csv' csv header;

-- Create the dedicated user with read-only access
create user covid_app noinherit;
grant connect on database micado to covid_app;
grant usage on schema public to covid_app;
grant select on covid_19_new_zealand to covid_app;
