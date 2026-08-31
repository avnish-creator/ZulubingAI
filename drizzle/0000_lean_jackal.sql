CREATE TABLE `coaching_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`dob` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) DEFAULT '',
	`parentName` varchar(255) DEFAULT '',
	`schoolCollege` varchar(255) DEFAULT '',
	`currentClass` varchar(128) DEFAULT '',
	`course` varchar(255) NOT NULL,
	`batchTiming` varchar(128) DEFAULT '',
	`experienceLevel` varchar(128) DEFAULT '',
	`referralSource` varchar(255) DEFAULT '',
	`additionalNotes` text,
	`status` varchar(64) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coaching_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` varchar(64) NOT NULL DEFAULT 'contact',
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255) DEFAULT '',
	`title` varchar(255) DEFAULT '',
	`country` varchar(128) DEFAULT '',
	`phone` varchar(64) DEFAULT '',
	`service` varchar(255) DEFAULT '',
	`platform` varchar(255) DEFAULT '',
	`description` text,
	`timeline` varchar(128) DEFAULT '',
	`additional` text,
	`status` varchar(64) NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
