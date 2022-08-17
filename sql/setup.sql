-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists github_users;
drop table if exists posts;

create table github_users (
    id bigint generated always as identity primary key,
    username text not null,
    email text,
    avatar text
);

create table posts (
    id bigint generated always as identity primary key,
    user_id bigint not null,
    content varchar(255)
);

insert into github_users (
    username, 
    email, 
    avatar
)
values
('geg', 'geg@geg.com', 'geg.jpg'),
('deg', 'deg@deg.com', 'deg.jpg');

insert into posts (
    user_id,
    content
)
values
('1', 'wow is this dope'),
('2', 'woah');