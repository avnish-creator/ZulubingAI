-- TiDB caches AUTO_INCREMENT ids in blocks of 30000 per node, so ids jump
-- (1, 30001, 60001, ...) whenever a different node or connection serves the
-- insert. AUTO_ID_CACHE 1 switches TiDB to centralized allocation so ids stay
-- sequential. This is a TiDB-specific statement and is a no-op risk on plain
-- MySQL, which does not support AUTO_ID_CACHE.
ALTER TABLE `coaching_enrollments` AUTO_ID_CACHE 1;
--> statement-breakpoint
ALTER TABLE `contact_submissions` AUTO_ID_CACHE 1;
--> statement-breakpoint
ALTER TABLE `users` AUTO_ID_CACHE 1;
