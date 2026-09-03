-- AUTO_ID_CACHE = 1 must be set at CREATE TABLE time. TiDB rejects
-- "ALTER TABLE ... AUTO_ID_CACHE 1" on a table created with the default
-- cache ("Can't Alter AUTO_ID_CACHE between 1 and non-1"), because cache 1
-- uses a different, centralized id allocator. Without it TiDB hands out ids
-- in blocks of 30000 per node, producing jumps like 1, 30001, 60001.
CREATE TABLE `workshop_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) DEFAULT '',
	`seminar` varchar(255) NOT NULL,
	`status` varchar(64) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workshop_enrollments_id` PRIMARY KEY(`id`)
) AUTO_ID_CACHE = 1;
