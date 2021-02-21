FROM postgres:13.2

# Locale
RUN localedef -i en_NZ -c -f UTF-8 -A /usr/share/locale/locale.alias en_NZ.UTF-8
ENV LANG en_NZ.utf8

COPY --chown=postgres:postgres covid_19_new_zealand.csv /tmp/covid_19_new_zealand.csv
COPY --chown=postgres:postgres init.sql /docker-entrypoint-initdb.d/init.sql

ENV POSTGRES_PASSWORD=micado
ENV POSTGRES_USER=micado
ENV POSTGRES_DB=micado
