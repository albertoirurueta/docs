CREATE TABLE book (id serial PRIMARY KEY, title text NOT NULL, author text NOT NULL);
CREATE TABLE loan (id serial PRIMARY KEY, book_id integer REFERENCES book (id), borrowed_at timestamptz DEFAULT now());
INSERT INTO book (title, author) VALUES ('Site Reliability Engineering', 'Beyer et al.'), ('Observability Engineering', 'Majors et al.');
