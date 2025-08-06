import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uuid,
  pgEnum,
  integer,
  json,
  index,
} from 'drizzle-orm/pg-core';

export const auth_provider_enum = pgEnum('auth_provider', ['email', 'google', 'github']);
export const user_role_enum = pgEnum('user_role', ['user', 'member', 'admin']);
export const monitor_status_enum = pgEnum('monitor_status', [
  'success',
  'failure',
  'timeout',
  'error',
]);
export const monitor_http_method_enum = pgEnum('monitor_http_method', [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
]);

export const incident_status_enum = pgEnum('incident_status', [
  'investigating',
  'identified',
  'monitoring',
  'resolved',
]);

export const incident_severity_enum = pgEnum('incident_severity', ['minor', 'major', 'critical']);

export const system_status_enum = pgEnum('system_status', [
  'operational',
  'degraded_performance',
  'partial_outage',
  'major_outage',
  'under_maintenance',
]);

export const plan_name_enum = pgEnum('plan_name', ['free', 'pro']);
export const billing_cycle_enum = pgEnum('billing_cycle', ['monthly', 'yearly']);
export const subscription_status_enum = pgEnum('subscription_status', [
  'active',
  'cancelled',
  'expired',
  'past_due',
]);

export const user = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }),
    name: varchar('name', { length: 100 }),
    avatar_url: text('avatar_url'),
    auth_provider: auth_provider_enum('auth_provider').notNull().default('email'),
    provider_id: varchar('provider_id', { length: 255 }),
    is_active: boolean('is_active').notNull().default(true),
    email_verified_at: timestamp('email_verified_at'),
    last_signed_in_at: timestamp('last_signed_in_at'),
    role: user_role_enum('role').notNull().default('user'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('user_email_idx').on(table.email)]
);

export const monitor = pgTable(
  'monitor',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    image_url: text('image_url'),
    description: text('description'),
    base_url: text('base_url').notNull(),
    http_method: monitor_http_method_enum('http_method').notNull().default('GET'),
    headers: json('headers'),
    request_body: json('request_body'),
    expected_status_code: integer('expected_status_code').notNull().default(200),
    is_active: boolean('is_active').notNull().default(true),
    is_archived: boolean('is_archived').notNull().default(false),
    check_interval: varchar('check_interval').notNull().default('90'), // 90 seconds
    last_check_at: timestamp('last_check_at'),
    next_check_at: timestamp('next_check_at').notNull().defaultNow(),
    email_notifications: boolean('email_notifications').notNull().default(false),
    slack_notifications: boolean('slack_notifications').notNull().default(false),
    teams_notifications: boolean('teams_notifications').notNull().default(false),
    discord_notifications: boolean('discord_notifications').notNull().default(false),
    slack_webhook_url: text('slack_webhook_url'),
    teams_webhook_url: text('teams_webhook_url'),
    discord_webhook_url: text('discord_webhook_url'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('monitor_user_id_idx').on(table.user_id),
    index('monitor_is_active_idx').on(table.is_active),
    index('monitor_is_archived_idx').on(table.is_archived),
    index('monitor_check_interval_idx').on(table.check_interval),
    index('monitor_last_check_at_idx').on(table.last_check_at),
    index('monitor_next_check_at_idx').on(table.next_check_at),
  ]
);

export const monitor_logs = pgTable(
  'monitor_logs',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    monitor_id: uuid('monitor_id').references(() => monitor.id, { onDelete: 'cascade' }),
    status: monitor_status_enum('status').notNull(),
    status_code: integer('status_code'),
    response_time: integer('response_time'),
    response_body: json('response_body'),
    error_message: text('error_message'),
    checked_at: timestamp('checked_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
  },
  (table) => [
    index('monitor_logs_monitor_id_idx').on(table.monitor_id),
    index('monitor_logs_status_idx').on(table.status),
    index('monitor_logs_checked_at_idx').on(table.checked_at),
    index('monitor_logs_deleted_at_idx').on(table.deleted_at),
  ]
);

export const status_page = pgTable(
  'status_page',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    image_url: text('image_url'),
    favicon_url: text('favicon_url'),
    custom_domain: text('custom_domain'),
    is_public: boolean('is_public').notNull().default(false),
    status: system_status_enum('status').notNull().default('operational'),
    status_message: text('status_message'),
    last_status_change_at: timestamp('last_status_change_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('status_page_user_id_idx').on(table.user_id),
    index('status_page_is_public_idx').on(table.is_public),
    index('status_page_status_idx').on(table.status),
  ]
);

export const status_page_monitors = pgTable(
  'status_page_monitors',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    status_page_id: uuid('status_page_id')
      .references(() => status_page.id, { onDelete: 'cascade' })
      .notNull(),
    monitor_id: uuid('monitor_id')
      .references(() => monitor.id, { onDelete: 'cascade' })
      .notNull(),
    display_name: varchar('display_name', { length: 255 }),
    display_order: integer('display_order').notNull().default(0),
    is_public: boolean('is_public').notNull().default(true),
  },
  (table) => [
    index('status_page_monitors_status_page_id_idx').on(table.status_page_id),
    index('status_page_monitors_monitor_id_idx').on(table.monitor_id),
    index('status_page_monitors_display_order_idx').on(table.display_order),
    index('status_page_monitors_is_public_idx').on(table.is_public),
  ]
);

export const incident = pgTable(
  'incident',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    monitor_id: uuid('monitor_id').references(() => monitor.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: incident_status_enum('status').notNull().default('investigating'),
    severity: incident_severity_enum('severity').notNull().default('minor'),
    started_at: timestamp('started_at').notNull(),
    resolved_at: timestamp('resolved_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
  },
  (table) => [
    index('incident_monitor_id_idx').on(table.monitor_id),
    index('incident_status_idx').on(table.status),
    index('incident_severity_idx').on(table.severity),
    index('incident_started_at_idx').on(table.started_at),
    index('incident_resolved_at_idx').on(table.resolved_at),
    index('incident_deleted_at_idx').on(table.deleted_at),
  ]
);

export const incident_updates = pgTable(
  'incident_updates',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    incident_id: uuid('incident_id')
      .references(() => incident.id, { onDelete: 'cascade' })
      .notNull(),
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
    status: incident_status_enum('status').notNull(),
    message: text('message').notNull(),
    is_public: boolean('is_public').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
  },
  (table) => [
    index('incident_updates_incident_id_idx').on(table.incident_id),
    index('incident_updates_user_id_idx').on(table.user_id),
    index('incident_updates_status_idx').on(table.status),
    index('incident_updates_created_at_idx').on(table.created_at),
    index('incident_updates_is_public_idx').on(table.is_public),
    index('incident_updates_deleted_at_idx').on(table.deleted_at),
  ]
);

export const signin_history = pgTable('signin_history', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  ip_address: text('ip_address').notNull(),
  os: text('os').notNull(),
  browser: text('browser').notNull(),
  device: text('device').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  region: text('region').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const plan = pgTable('plan', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: plan_name_enum('name').notNull().default('free'),
  description: text('description'),
  price: integer('price').notNull().default(0),
  billing_cycle: billing_cycle_enum('billing_cycle').default('monthly'),
  max_monitors: integer('max_monitors').notNull().default(1),
  max_status_pages: integer('max_status_pages').notNull().default(1),
  max_members: integer('max_members').notNull().default(2),
  features: json('features'), // Store plan features as JSON
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const user_plan = pgTable(
  'user_plan',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    plan_id: uuid('plan_id')
      .references(() => plan.id, { onDelete: 'restrict' })
      .notNull(),
    status: subscription_status_enum('status').notNull().default('active'),
    started_at: timestamp('started_at').notNull().defaultNow(),
    expires_at: timestamp('expires_at'),
    cancelled_at: timestamp('cancelled_at'),
    stripe_subscription_id: varchar('stripe_subscription_id', { length: 255 }),
    stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('user_plan_user_id_idx').on(table.user_id),
    index('user_plan_plan_id_idx').on(table.plan_id),
    index('user_plan_status_idx').on(table.status),
    index('user_plan_expires_at_idx').on(table.expires_at),
  ]
);
