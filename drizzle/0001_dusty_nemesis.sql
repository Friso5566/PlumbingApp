CREATE TABLE `plumbing_queries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`queryType` enum('text','image') NOT NULL,
	`queryText` text,
	`imageUrl` varchar(512),
	`response` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plumbing_queries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `plumbing_queries` ADD CONSTRAINT `plumbing_queries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;