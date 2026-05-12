-- Add new schema named "catalog"
CREATE SCHEMA "catalog";
-- Add new schema named "outbox"
CREATE SCHEMA "outbox";
-- Create "categories" table
CREATE TABLE "catalog"."categories" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "description" text NULL,
  "image" text NULL,
  "display_order" integer NOT NULL DEFAULT 0,
  "parent_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "categories_slug_key" UNIQUE ("slug"),
  CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "catalog"."categories" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "events" table
CREATE TABLE "outbox"."events" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "aggregate_type" character varying(255) NOT NULL,
  "aggregate_id" uuid NOT NULL,
  "type" character varying(255) NOT NULL,
  "payload" jsonb NOT NULL,
  "metadata" jsonb NOT NULL,
  "occurred_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
-- Create "distributors" table
CREATE TABLE "catalog"."distributors" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "bio" text NULL,
  "image" text NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
-- Create "publishers" table
CREATE TABLE "catalog"."publishers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "bio" text NULL,
  "image" text NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
-- Create "books" table
CREATE TABLE "catalog"."books" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "isbn" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" jsonb NOT NULL,
  "dimension" jsonb NOT NULL,
  "release_date" date NOT NULL,
  "page_count" integer NULL,
  "cover_material" text NULL,
  "images" text[] NOT NULL DEFAULT '{}',
  "status" text NOT NULL DEFAULT 'DRAFT',
  "published_at" timestamp NULL,
  "discontinued_at" timestamp NULL,
  "category_id" uuid NOT NULL,
  "publisher_id" uuid NOT NULL,
  "distributor_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "books_isbn_key" UNIQUE ("isbn"),
  CONSTRAINT "books_slug_key" UNIQUE ("slug"),
  CONSTRAINT "books_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "catalog"."categories" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "books_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "catalog"."distributors" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "books_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "catalog"."publishers" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "books_status_check" CHECK (status = ANY (ARRAY['DRAFT'::text, 'UNPUBLISHED'::text, 'PUBLISHED'::text, 'DISCONTINUED'::text]))
);
-- Create "authors" table
CREATE TABLE "catalog"."authors" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "bio" text NULL,
  "image" text NULL,
  "social_links" jsonb NOT NULL DEFAULT '{}',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "authors_slug_key" UNIQUE ("slug")
);
-- Create "books_authors" table
CREATE TABLE "catalog"."books_authors" (
  "book_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  PRIMARY KEY ("book_id", "author_id"),
  CONSTRAINT "books_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "catalog"."authors" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "books_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "tags" table
CREATE TABLE "catalog"."tags" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "tags_slug_key" UNIQUE ("slug")
);
-- Create "books_tags" table
CREATE TABLE "catalog"."books_tags" (
  "book_id" uuid NOT NULL,
  "tag_id" uuid NOT NULL,
  PRIMARY KEY ("book_id", "tag_id"),
  CONSTRAINT "books_tags_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "books_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "catalog"."tags" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
