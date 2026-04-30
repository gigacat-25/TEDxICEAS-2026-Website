CREATE TABLE `schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`time` text NOT NULL,
	`event` text NOT NULL,
	`display_order` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
