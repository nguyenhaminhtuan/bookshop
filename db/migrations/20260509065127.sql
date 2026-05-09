-- Add new schema named "events"
CREATE SCHEMA "events";
-- Create "outbox" table
CREATE TABLE "events"."outbox" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "aggregate_type" character varying(255) NOT NULL,
  "aggregate_id" character varying(255) NOT NULL,
  "type" character varying(255) NOT NULL,
  "payload" jsonb NOT NULL,
  "metadata" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
