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
);
--> statement-breakpoint
ALTER TABLE `workshop_enrollments` AUTO_ID_CACHE 1;
