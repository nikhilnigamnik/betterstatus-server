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
  decimal,
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
    password: varchar('password', { length: 255 }), // password will be hashed
    name: varchar('name', { length: 100 }),
    avatar_url: text('avatar_url'), // avatar will be stored in the cloudflare r2 bucket
    auth_provider: auth_provider_enum('auth_provider').notNull().default('email'), // email, google, github
    provider_id: varchar('provider_id', { length: 255 }),
    is_active: boolean('is_active').notNull().default(true), // user can be deactivated by admin
    email_verified_at: timestamp('email_verified_at'), // email will be verified by admin
    last_signed_in_at: timestamp('last_signed_in_at'), // last time user signed in
    role: user_role_enum('role').notNull().default('user'), // user, member, admin
    created_at: timestamp('created_at').notNull().defaultNow(), // user created at
    updated_at: timestamp('updated_at').notNull().defaultNow(), // user updated at
  },
  (table) => [index('user_email_idx').on(table.email)]
);

export const monitor = pgTable(
  'monitor',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(), // monitor name
    image_url: text('image_url'), // monitor image will be stored in the cloudflare r2 bucket
    description: text('description'), // monitor description
    base_url: text('base_url').notNull(), // monitor base url
    http_method: monitor_http_method_enum('http_method').notNull().default('GET'), // monitor http method eg GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
    headers: json('headers'), // monitor headers eg. { 'Content-Type': 'application/json' }
    request_body: json('request_body'), // monitor request body eg. { 'name': 'John Doe' }
    expected_status_code: integer('expected_status_code').notNull().default(200), // monitor expected status code eg. 200, 201, 202, 204, 400, 401, 403, 404, 500, 502, 503, 504
    is_active: boolean('is_active').notNull().default(true), // monitor is active, can be deactivated by user
    is_archived: boolean('is_archived').notNull().default(false), // monitor is archived, can be restored by user
    check_interval: integer('check_interval').notNull().default(90), // seconds, minimum 30
    last_check_at: timestamp('last_check_at'), // last time monitor was checked
    next_check_at: timestamp('next_check_at').notNull().defaultNow(), // next time monitor will be checked
    email_notifications: boolean('email_notifications').notNull().default(false), // monitor email notifications
    slack_notifications: boolean('slack_notifications').notNull().default(false), // monitor slack notifications
    teams_notifications: boolean('teams_notifications').notNull().default(false), // monitor teams notifications
    discord_notifications: boolean('discord_notifications').notNull().default(false), // monitor discord notifications
    slack_webhook_url: text('slack_webhook_url'), // monitor slack webhook url
    teams_webhook_url: text('teams_webhook_url'), // monitor teams webhook url
    discord_webhook_url: text('discord_webhook_url'), // monitor discord webhook url
    created_at: timestamp('created_at').notNull().defaultNow(), // monitor created at
    updated_at: timestamp('updated_at').notNull().defaultNow(), // monitor updated at
  },
  (table) => [
    index('monitor_user_id_idx').on(table.user_id),
    index('monitor_is_active_idx').on(table.is_active),
    index('monitor_is_archived_idx').on(table.is_archived),
    index('monitor_check_interval_idx').on(table.check_interval),
    index('monitor_last_check_at_idx').on(table.last_check_at),
    index('monitor_next_check_at_idx').on(table.next_check_at),
    index('monitor_user_active_idx').on(table.user_id, table.is_active),
    index('monitor_next_check_active_idx').on(table.next_check_at, table.is_active),
  ]
);

export const monitor_logs = pgTable(
  'monitor_logs',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    monitor_id: uuid('monitor_id').references(() => monitor.id, { onDelete: 'cascade' }),
    status: monitor_status_enum('status').notNull(), // monitor status eg. success, failure, timeout, error
    status_code: integer('status_code'), // monitor status code eg. 200, 201, 202, 204, 400, 401, 403, 404, 500, 502, 503, 504
    response_time: integer('response_time'), // milliseconds
    response_body: json('response_body'), // monitor response body eg. { 'name': 'John Doe' }
    error_message: text('error_message'), // monitor error message eg. 'Connection timed out'
    checked_at: timestamp('checked_at').notNull().defaultNow(), // monitor checked at
    deleted_at: timestamp('deleted_at'), // monitor deleted at
  },
  (table) => [
    index('monitor_logs_monitor_id_idx').on(table.monitor_id),
    index('monitor_logs_status_idx').on(table.status),
    index('monitor_logs_checked_at_idx').on(table.checked_at),
    index('monitor_logs_deleted_at_idx').on(table.deleted_at),
    index('monitor_logs_monitor_checked_idx').on(table.monitor_id, table.checked_at),
    index('monitor_logs_status_checked_idx').on(table.status, table.checked_at),
    index('monitor_logs_monitor_status_idx').on(table.monitor_id, table.status),
  ]
);

export const status_page = pgTable(
  'status_page',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(), // status page name eg. 'BetterStatus'
    description: text('description'), // status page description
    image_url: text('image_url'), // status page image will be stored in the cloudflare r2 bucket
    favicon_url: text('favicon_url'), // status page favicon will be stored in the cloudflare r2 bucket
    custom_domain: text('custom_domain'), // status page custom domain eg. 'status.betterstatus.com'
    is_public: boolean('is_public').notNull().default(false), // status page is public, can be accessed by anyone
    status: system_status_enum('status').notNull().default('operational'), // status page status eg. operational, degraded_performance, partial_outage, major_outage, under_maintenance
    status_message: text('status_message'), // status page status message eg. 'We are experiencing some issues, please check back later.'
    last_status_change_at: timestamp('last_status_change_at'), // status page last status change at
    created_at: timestamp('created_at').notNull().defaultNow(), // status page created at
    updated_at: timestamp('updated_at').notNull().defaultNow(), // status page updated at
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
      .notNull(), // status page id
    monitor_id: uuid('monitor_id')
      .references(() => monitor.id, { onDelete: 'cascade' })
      .notNull(), // monitor id
    display_name: varchar('display_name', { length: 255 }), // status page monitor display name eg. 'API'
    display_order: integer('display_order').notNull().default(0), // status page monitor display order eg. 0, 1, 2, 3, 4, 5
    is_public: boolean('is_public').notNull().default(true), // status page monitor is public, can be accessed by anyone
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
    title: varchar('title', { length: 255 }).notNull(), // incident title eg. 'API is down'
    description: text('description'), // incident description eg. 'The API is not responding to requests.'
    status: incident_status_enum('status').notNull().default('investigating'), // incident status eg. investigating, identified, monitoring, resolved
    severity: incident_severity_enum('severity').notNull().default('minor'), // incident severity eg. minor, major, critical
    started_at: timestamp('started_at').notNull(), // incident started at
    resolved_at: timestamp('resolved_at'), // incident resolved at
    created_at: timestamp('created_at').notNull().defaultNow(), // incident created at
    updated_at: timestamp('updated_at').notNull().defaultNow(), // incident updated at
    deleted_at: timestamp('deleted_at'), // incident deleted at
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
      .notNull(), // incident id
    user_id: uuid('user_id').references(() => user.id, { onDelete: 'set null' }), // user id
    status: incident_status_enum('status').notNull(), // incident status eg. investigating, identified, monitoring, resolved
    message: text('message').notNull(), // incident message eg. 'The API is not responding to requests.'
    is_public: boolean('is_public').notNull().default(true), // incident is public, can be accessed by anyone
    created_at: timestamp('created_at').notNull().defaultNow(), // incident created at
    deleted_at: timestamp('deleted_at'), // incident deleted at
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
  ip_address: text('ip_address').notNull(), // signin history ip address eg. '127.0.0.1'
  os: text('os').notNull(), // signin history os eg. 'Windows'
  browser: text('browser').notNull(), // signin history browser eg. 'Chrome'
  device: text('device').notNull(), // signin history device eg. 'Desktop'
  country: text('country').notNull(), // signin history country eg. 'United States'
  city: text('city').notNull(), // signin history city eg. 'New York'
  region: text('region').notNull(), // signin history region eg. 'New York'
  created_at: timestamp('created_at').notNull().defaultNow(), // signin history created at
});

export const plan = pgTable('plan', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: plan_name_enum('name').notNull().default('free'), // plan name eg. 'Free'
  description: text('description'), // plan description eg. 'Free plan'
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'), // USD with 2 decimal places
  billing_cycle: billing_cycle_enum('billing_cycle').default('monthly'), // plan billing cycle eg. monthly, yearly
  max_monitors: integer('max_monitors').notNull().default(1), // plan max monitors eg. 1
  max_status_pages: integer('max_status_pages').notNull().default(1), // plan max status pages eg. 1
  max_members: integer('max_members').notNull().default(2), // plan max members eg. 2
  is_active: boolean('is_active').notNull().default(true), // plan is active, can be deactivated by admin
  created_at: timestamp('created_at').notNull().defaultNow(), // plan created at
  updated_at: timestamp('updated_at').notNull().defaultNow(), // plan updated at
});

export const user_plan = pgTable(
  'user_plan',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    user_id: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(), // user id
    plan_id: uuid('plan_id')
      .references(() => plan.id, { onDelete: 'restrict' })
      .notNull(), // plan id
    status: subscription_status_enum('status').notNull().default('active'), // plan status eg. active, cancelled, expired, past_due
    started_at: timestamp('started_at').notNull().defaultNow(), // plan started at
    expires_at: timestamp('expires_at'), // plan expires at
    cancelled_at: timestamp('cancelled_at'), // plan cancelled at
    stripe_subscription_id: varchar('stripe_subscription_id', { length: 255 }), // plan stripe subscription id
    stripe_customer_id: varchar('stripe_customer_id', { length: 255 }), // plan stripe customer id
    created_at: timestamp('created_at').notNull().defaultNow(), // plan created at
    updated_at: timestamp('updated_at').notNull().defaultNow(), // plan updated at
  },
  (table) => [
    index('user_plan_user_id_idx').on(table.user_id),
    index('user_plan_plan_id_idx').on(table.plan_id),
    index('user_plan_status_idx').on(table.status),
    index('user_plan_expires_at_idx').on(table.expires_at),
  ]
);
