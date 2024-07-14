const string1 = `SELECT concat(
	'private ', java_type, ' ', (lower(substring(pascal_case,1,1)) || substring(pascal_case,2)), ';',
	' /* ', COLUMN_COMMENT, ' */'
	) as java_vo_string
FROM (
SELECT a.column_name
	,replace(initcap(replace(a.column_name, '_', ' ')), ' ', '') As pascal_case
	,CASE WHEN a.data_type in('character', 'character varying') THEN 'String'
			WHEN a.data_type in('timestamp without time zone', 'timestamp') THEN 'LocalDateTime'
			WHEN a.data_type in('numeric') THEN 'Double'
			WHEN a.data_type in('integer') THEN 'Long'
			WHEN a.data_type in('boolean') THEN 'Boolean'
			WHEN a.data_type in('date') THEN 'LocalDate'
            ELSE
             	''
            END AS java_type
	,b.COLUMN_COMMENT
FROM information_schema.columns a
	inner join (
		SELECT
			PS.RELNAME AS TABLE_NAME,
			PA.ATTNAME AS COLUMN_NAME,
			PD.DESCRIPTION AS COLUMN_COMMENT
		FROM PG_STAT_ALL_TABLES PS, PG_DESCRIPTION PD, PG_ATTRIBUTE PA
		WHERE PD.OBJSUBID<>0
			AND PS.RELID=PD.OBJOID
			AND PD.OBJOID=PA.ATTRELID
			AND PD.OBJSUBID=PA.ATTNUM
			AND PS.RELNAME= lower(?) ) b
			on a.column_name = b.column_name
WHERE a.table_name = lower(?)
order by a.ordinal_position) As data_type_comment`;

module.exports = {
  string1: string1,
};
