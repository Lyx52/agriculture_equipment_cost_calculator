DROP VIEW uzc_gazes.v_get_equipment_metadata;
DROP TABLE IF EXISTS uzc_gazes.technical_equipment;
DROP TABLE IF EXISTS uzc_gazes.codifier;

CREATE TABLE IF NOT EXISTS uzc_gazes.codifier
(
	id serial NOT NULL PRIMARY KEY,
	name varchar(200) NOT NULL,
	code varchar(200) NOT NULL,
	parent_id int DEFAULT(NULL),
	CONSTRAINT fk_codifier_parent 
		FOREIGN KEY(parent_id) 
        REFERENCES uzc_gazes.codifier(id)
);
CREATE UNIQUE INDEX codifier_code_idx ON uzc_gazes.codifier (code);
CREATE TABLE IF NOT EXISTS uzc_gazes.technical_equipment
(
    id serial NOT NULL PRIMARY KEY,
	mark varchar(200) NOT NULL,
	model varchar(200) NOT NULL,
	category_code varchar(200) NOT NULL,
	sub_category_code varchar(200) NOT NULL,
	equipment_level_code varchar(200) NOT NULL,
	price numeric(10, 2) DEFAULT(NULL),
	specification JSONB NOT NULL,
	sources JSONB NOT NULL
);

DROP TABLE uzc_gazes.macus_equipment_prices;
CREATE TABLE IF NOT EXISTS uzc_gazes.macus_equipment_prices
(
    id serial NOT NULL PRIMARY KEY,
	power_group varchar(100) NOT NULL,
	year numeric(4, 0) NOT NULL,
	listing_count numeric(5, 0) NOT NULL,
	motor_hours_mean numeric(10, 2) NOT NULL,
	price_mean numeric(10, 2) NOT NULL,
	category_code varchar(200) NOT NULL
);

ALTER TABLE IF EXISTS uzc_gazes.codifier
    OWNER to drupal8;
ALTER TABLE IF EXISTS uzc_gazes.technical_equipment
    OWNER to drupal8;

CREATE OR REPLACE PROCEDURE uzc_gazes.create_codifier(
   c_code text,
   c_name text, 
   c_parent_code text DEFAULT(NULL)
)

language plpgsql    
as $$
DECLARE
parent uzc_gazes.codifier%ROWTYPE;
codifier uzc_gazes.codifier%ROWTYPE;
begin
	SELECT * INTO codifier FROM uzc_gazes.codifier WHERE code = c_code;
	IF codifier IS NULL THEN
		IF c_parent_code IS NULL THEN
			INSERT INTO uzc_gazes.codifier(name, code, parent_id) VALUES (c_name, c_code, NULL);
		ELSE
			SELECT * INTO parent FROM uzc_gazes.codifier WHERE code = c_parent_code;
			INSERT INTO uzc_gazes.codifier(name, code, parent_id) VALUES (c_name, c_code, parent.id);
		END IF;
	END IF;
end;$$;

DROP VIEW uzc_gazes.v_equipment_categories;
CREATE OR REPLACE VIEW uzc_gazes.v_equipment_categories AS
SELECT DISTINCT t.category_code, t.sub_category_code, c.name AS category_name, sc.name AS sub_category_name FROM uzc_gazes.technical_equipment AS t
LEFT JOIN uzc_gazes.codifier AS c ON c.code = t.category_code 
LEFT JOIN uzc_gazes.codifier AS sc ON sc.code = t.sub_category_code 
WHERE c.name IS NOT NULL AND sc.name IS NOT NULL

DROP VIEW uzc_gazes.v_equipment_mark;
CREATE OR REPLACE VIEW uzc_gazes.v_equipment_mark AS
SELECT DISTINCT(mark) AS mark, t.category_code, t.sub_category_code 
FROM uzc_gazes.technical_equipment AS t

DROP VIEW uzc_gazes.v_equipment_mark_model;
CREATE OR REPLACE VIEW uzc_gazes.v_equipment_mark_model AS
SELECT DISTINCT(t.model) AS model, t.mark, t.category_code, t.sub_category_code 
FROM uzc_gazes.technical_equipment AS t

DROP VIEW uzc_gazes.v_equipment_search;
CREATE OR REPLACE VIEW uzc_gazes.v_equipment_search AS
SELECT 
	t.id, 
	concat(t.mark, ' ', t.model, ' (', c.name, ') ',
        CASE
            WHEN (t.specification -> 'power'::text) IS NOT NULL THEN concat((t.specification -> 'power'::text)::numeric(10,2), ' kw')
            ELSE ''::text
        END) AS full_name,
	t.mark,
	t.model,
	t.price,
	t.category_code,
	t.sub_category_code,
	t.equipment_level_code,
	t.specification,
	t.sources,
	t.specification -> 'power' AS power
FROM uzc_gazes.technical_equipment AS t
LEFT JOIN uzc_gazes.codifier AS c ON c.code = t.equipment_level_code

CREATE OR REPLACE VIEW uzc_gazes.v_technical_equipment_filters AS
 SELECT tm.mark,
    tm.model,
    c.name AS category_name,
    c.code AS category_code
   FROM uzc_gazes.technical_equipment tm
     LEFT JOIN uzc_gazes.codifier c ON c.code::text = tm.category_code::text
  ORDER BY tm.mark;