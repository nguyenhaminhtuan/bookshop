CREATE SCHEMA IF NOT EXISTS "outbox";

CREATE TABLE "outbox"."events" (
  "id"             uuid NOT NULL DEFAULT gen_random_uuid(),
  "aggregate_type" varchar(255) NOT NULL,
  "aggregate_id"   uuid NOT NULL,
  "type"           varchar(255) NOT NULL,
  "payload"        jsonb NOT NULL,
  "metadata"       jsonb NOT NULL,
  "occurred_at"    timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);

CREATE TABLE "outbox"."processed_events" (
  "event_id"     uuid NOT NULL,
  "handler_name" text NOT NULL,
  "processed_at" timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("event_id", "handler_name")
);

CREATE SCHEMA IF NOT EXISTS "catalog";

CREATE TABLE "catalog"."publishers" (
  "id"         uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"       text NOT NULL,
  "bio"        text,
  "image"      text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."distributors" (
  "id"         uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"       text NOT NULL,
  "bio"        text,
  "image"      text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."categories" (
  "id"            uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"          text NOT NULL,
  "slug"          text NOT NULL UNIQUE,
  "description"   text,
  "image"         text,
  "display_order" integer NOT NULL DEFAULT 0,
  "parent_id"     uuid NOT NULL,
  "created_at"    timestamp NOT NULL DEFAULT now(),
  "updated_at"    timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id"),
  FOREIGN KEY ("parent_id") REFERENCES "catalog"."categories" ("id")
);

CREATE TABLE "catalog"."authors" (
  "id"             uuid NOT NULL DEFAULT gen_random_uuid(),
  "slug"           text NOT NULL UNIQUE,
  "name"           text NOT NULL,
  "bio"            text,
  "image"          text,
  "social_links"   jsonb NOT NULL DEFAULT '{}',
  "created_at"     timestamp NOT NULL DEFAULT now(),
  "updated_at"     timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."tags" (
  "id"         uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"       text NOT NULL,
  "slug"       text NOT NULL UNIQUE,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."books" (
  "id"              uuid NOT NULL DEFAULT gen_random_uuid(),
  "slug"            text NOT NULL UNIQUE,
  "isbn"            text NOT NULL UNIQUE,
  "title"           text NOT NULL,
  "description"     text NOT NULL,
  "price"           jsonb NOT NULL,
  "dimension"       jsonb NOT NULL,
  "release_date"    date NOT NULL,
  "page_count"      integer,
  "cover_material"  text,
  "images"          text[] NOT NULL DEFAULT '{}',
  "status"          text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'UNPUBLISHED', 'PUBLISHED', 'DISCONTINUED')),
  "published_at"    timestamp,
  "discontinued_at" timestamp,
  "category_id"     uuid NOT NULL,
  "publisher_id"    uuid NOT NULL,
  "distributor_id"  uuid NOT NULL,
  "created_at"      timestamp NOT NULL DEFAULT now(),
  "updated_at"      timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id"),
  FOREIGN KEY ("category_id") REFERENCES "catalog"."categories" ("id"),
  FOREIGN KEY ("publisher_id") REFERENCES "catalog"."publishers" ("id"),
  FOREIGN KEY ("distributor_id") REFERENCES "catalog"."distributors" ("id")
);

CREATE TABLE "catalog"."book_authors" (
  "book_id"   uuid NOT NULL,
  "author_id" uuid NOT NULL,

  PRIMARY KEY ("book_id", "author_id"),
  FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id"),
  FOREIGN KEY ("author_id") REFERENCES "catalog"."authors" ("id")
);

CREATE TABLE "catalog"."book_tags" (
  "book_id" uuid NOT NULL,
  "tag_id"  uuid NOT NULL,

  PRIMARY KEY ("book_id", "tag_id"),
  FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id"),
  FOREIGN KEY ("tag_id") REFERENCES "catalog"."tags" ("id")
);

CREATE TABLE "catalog"."book_stats" (
  "book_id"        uuid NOT NULL,
  "average_rating" numeric(3, 2) NOT NULL DEFAULT 0,
  "total_reviews"  integer NOT NULL DEFAULT 0,
  "total_sales"    integer NOT NULL DEFAULT 0,
  "updated_at"     timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("book_id"),
  FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id")
);
