DROP TABLE IF EXISTS uzc_gazes.technical_equipment_metadata;
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
	category_code varchar(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS uzc_gazes.technical_equipment_metadata
(
    id serial NOT NULL PRIMARY KEY,
	technical_equipment_id int NOT NULL,
	code varchar(200) NOT NULL,
	equipment_level_code varchar(200) NOT NULL,
	value_text varchar(200) DEFAULT(NULL),
	value_numeric numeric(12, 3) DEFAULT(NULL),
	CONSTRAINT fk_technical_equipment 
		FOREIGN KEY(technical_equipment_id) 
        REFERENCES uzc_gazes.technical_equipment(id)
		ON DELETE CASCADE
);

ALTER TABLE IF EXISTS uzc_gazes.codifier
    OWNER to drupal8;
ALTER TABLE IF EXISTS uzc_gazes.technical_equipment_metadata
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

CREATE OR REPLACE PROCEDURE uzc_gazes.create_technical_equipment_metadata(
   t_mark text, 
   t_model text,
   t_category_code text,
   tm_equipment_level_code text,
   tm_code text,
   tm_value_text text DEFAULT(NULL),
   tm_value_numeric numeric(12, 3) DEFAULT(NULL)
)

language plpgsql    
as $$
DECLARE
technical_equipment uzc_gazes.technical_equipment%ROWTYPE;
begin
	SELECT * INTO technical_equipment FROM uzc_gazes.technical_equipment WHERE model = t_model AND mark = t_mark AND category_code = t_category_code;
	IF technical_equipment IS NOT NULL THEN
		INSERT INTO uzc_gazes.technical_equipment_metadata(technical_equipment_id, equipment_level_code, code, value_text, value_numeric) VALUES (technical_equipment.id, tm_equipment_level_code, tm_code, tm_value_text, tm_value_numeric);
	END IF;
end;$$;

CREATE OR REPLACE VIEW uzc_gazes.v_technical_equipment_filters
 AS
 SELECT tm.mark,
    tm.model,
    c.name AS category_name,
    c.code AS category_code
   FROM uzc_gazes.technical_equipment tm
     LEFT JOIN uzc_gazes.codifier c ON c.code::text = tm.category_code::text
  ORDER BY tm.mark;

DROP VIEW uzc_gazes.v_get_equipment_metadata;
CREATE OR REPLACE VIEW uzc_gazes.v_get_equipment_metadata AS
SELECT 
	tm.technical_equipment_id AS equipment_id,
	tm.equipment_level_code AS equipment_level,
	tm.value_text AS "text",
	tm.value_numeric AS "numeric",
	c.code AS value_code, 
	c.name AS value_name
	FROM uzc_gazes.technical_equipment_metadata AS tm
LEFT JOIN uzc_gazes.codifier AS c ON c.code = tm.code;