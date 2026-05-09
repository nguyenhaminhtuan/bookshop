CREATE SCHEMA IF NOT EXISTS "events";

CREATE TABLE "events"."outbox" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "aggregate_type" varchar(255) NOT NULL,
  "aggregate_id" varchar(255) NOT NULL,
  "type" varchar(255) NOT NULL,
  "payload" jsonb NOT NULL,
  "metadata" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),

  PRIMARY KEY ("id")
);
