// understanding and style takken from tutorial 18/03
// https://ucc.instructure.com/courses/86289/files/10156973?module_item_id=2916890
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: integer('created_at').notNull(),
    });

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userID: integer('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    colour: text('colour').notNull(),
    icon: text('icon').notNull(),
});

export const applications = sqliteTable('applications', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userID: integer('user_id').references(() => users.id).notNull(),
    categoryID: integer('category_id').references(() => categories.id),
    companyName: text('company_name').notNull(),
    position: text('position').notNull(),
    notes: text('notes'),
    metric: integer('metric').notNull().default(1),
    appliedAt: integer('applied_at').notNull(),
    createdAt: integer('created_at').notNull(),
});

export const applicationStatusLogs = sqliteTable('application_status_logs', {
    id: integer('id').primaryKey({autoIncrement: true}),
    applicationID: integer('application_id').references(() => applications.id).notNull(),
    oldStatus: integer('old_status').notNull(),
    newStatus: integer('new_status').notNull(),
    changedAt: integer('changed_at').notNull(),
});

export const targets = sqliteTable('targets', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userID: integer('user_id').references(() => users.id),
    period: text('period').notNull(),
    goalValue: integer('goal_value').notNull(),
});