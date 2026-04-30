CREATE TABLE `tickets` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `user_email` text NOT NULL,
  `ticket_type` text DEFAULT 'general' NOT NULL,
  `price` integer DEFAULT 0 NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` integer NOT NULL
);
