import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const speakers = sqliteTable('speakers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  teamGroup: text('team_group').notNull().default('core'), // 'core' or 'volunteer'
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const sponsors = sqliteTable('sponsors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tier: text('tier').notNull(), // 'platinum', 'gold', 'silver', etc.
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const tickets = sqliteTable('tickets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk User ID
  userEmail: text('user_email').notNull(),
  ticketType: text('ticket_type').notNull().default('general'), // 'general', 'student'
  price: integer('price').notNull().default(0),
  status: text('status').notNull().default('pending'), // 'pending', 'confirmed', 'cancelled'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
export const schedule = sqliteTable('schedule', {
  id: text('id').primaryKey(),
  time: text('time').notNull(),
  event: text('event').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
