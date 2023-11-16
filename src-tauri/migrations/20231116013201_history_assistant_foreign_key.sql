ALTER TABLE history
ADD COLUMN assistant_id INTEGER REFERENCES assistants (id);