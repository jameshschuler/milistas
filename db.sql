CREATE TABLE access_code (
	access_code_id serial PRIMARY KEY,
	account_id INT NOT NULL,
	code VARCHAR NOT NULL,
	expiration_date TIMESTAMP,
	created_on TIMESTAMP NOT NULL default current_timestamp,
    updated_on TIMESTAMP,
	FOREIGN KEY (account_id) REFERENCES account (account_id)
);