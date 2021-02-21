-- Set the date style
set datestyle to "ISO, DMY";

-- Create the table
create table covid_19_new_zealand
(
    id                serial not null,
    class             varchar(32),
    category          varchar(32),
    indicator_name    varchar(128),
    series_name       varchar(128),
    sub_series_name   varchar(128),
    parameter         date,
    value             double precision,
    units             varchar(32),
    date_last_updated date
);
comment on table covid_19_new_zealand is 'Covid 19 database from Stats NZ';

-- Create the dedicated user with read-only access
create user covid_app noinherit password 'covid_app';
grant connect on database micado to covid_app;
grant usage on schema public to covid_app;
grant select on covid_19_new_zealand to covid_app;

-- Import
copy covid_19_new_zealand (class,
                           category,
                           indicator_name,
                           series_name,
                           sub_series_name,
                           parameter,
                           value,
                           units,
                           date_last_updated) from '/tmp/covid_19_new_zealand.csv' csv header;
