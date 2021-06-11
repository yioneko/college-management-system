CREATE TYPE sex AS ENUM (
	'male',
	'female');

CREATE TABLE "admin" (
	adm_id bpchar(7) NOT NULL,
	pwd bpchar(60) NOT NULL,
	CONSTRAINT admin_pkey PRIMARY KEY (adm_id)
);

CREATE TABLE student (
	stu_id bpchar(10) NOT NULL,
	stu_name varchar(10) NOT NULL,
	sex sex NOT NULL,
	entrance_age int4 NOT NULL,
	entrance_year int4 NOT NULL,
	"class" varchar(20) NOT NULL,
	pwd bpchar(60) NOT NULL,
	CONSTRAINT student_entrance_age_check CHECK (((entrance_age > 10) AND (entrance_age < 50))),
	CONSTRAINT student_pkey PRIMARY KEY (stu_id)
);
CREATE INDEX student_class_idx ON student USING btree (class);
CREATE INDEX student_stu_name_idx ON student USING btree (stu_name);

CREATE TABLE teacher (
	tea_id bpchar(5) NOT NULL,
	tea_name varchar(10) NOT NULL,
	pwd bpchar(60) NOT NULL,
	CONSTRAINT teacher_pkey PRIMARY KEY (tea_id)
);
CREATE INDEX teacher_tea_name_idx ON teacher USING btree (tea_name);

CREATE TABLE course (
	cour_id bpchar(7) NOT NULL,
	cour_name varchar(10) NOT NULL,
	tea_id bpchar(5) NOT NULL,
	credit int4 NOT NULL,
	grade int4 NOT NULL,
	cancel_year int4 NULL,
	CONSTRAINT course_pkey PRIMARY KEY (cour_id),
	CONSTRAINT course_tea_id_fkey FOREIGN KEY (tea_id) REFERENCES teacher(tea_id) ON UPDATE CASCADE
);

CREATE TABLE choose (
	stu_id bpchar(10) NOT NULL,
	cour_id bpchar(7) NOT NULL,
	score int4 NULL,
	choose_year int4 NOT NULL DEFAULT date_part('year'::text, CURRENT_DATE),
	CONSTRAINT choose_pkey PRIMARY KEY (stu_id, cour_id, choose_year),
	CONSTRAINT choose_cour_id_fkey FOREIGN KEY (cour_id) REFERENCES course(cour_id) ON UPDATE CASCADE,
	CONSTRAINT choose_stu_id_fkey FOREIGN KEY (stu_id) REFERENCES student(stu_id) ON UPDATE CASCADE ON DELETE CASCADE
);

create trigger check_choose before
insert
    or
update
    on
    choose for each row execute function check_choose();


CREATE OR REPLACE FUNCTION check_choose()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
	BEGIN
		if (select cancel_year from course where cour_id = new.cour_id) <= new.choose_year then
			raise exception 'Cannot choose course already cancelled';
		end if;
		if (select entrance_year from student where stu_id = new.stu_id) > new.choose_year - (select grade from course where cour_id = new.cour_id) then
			raise exception 'Cannot choose course requiring higher grade';
		end if;
		return new;
	END;
$function$
;
