DROP VIEW uzc_gazes.v_equipment_search;
DROP TABLE IF EXISTS uzc_gazes.technical_equipment;
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

DROP TABLE IF EXISTS uzc_gazes.macus_equipment_prices;
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

ALTER TABLE IF EXISTS uzc_gazes.technical_equipment
    OWNER to drupal8;
ALTER TABLE IF EXISTS uzc_gazes.macus_equipment_prices
    OWNER to drupal8;

DROP VIEW IF EXISTS uzc_gazes.v_equipment_search;
CREATE OR REPLACE VIEW uzc_gazes.v_equipment_search AS
SELECT 
	CONCAT(t.mark, '', t.model) as full_name,
	t.mark,
	t.model,
	t.price,
	t.category_code,
	t.sub_category_code,
	t.equipment_level_code,
	t.specification,
	t.sources,
	t.specification -> 'engine_power_kw' as "power"
FROM uzc_gazes.technical_equipment AS t