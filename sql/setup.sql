-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists github_users;

create table github_users (
    id bigint generated always as identity primary key,
    username text not null,
    email text,
    avatar text
)