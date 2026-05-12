-- Create "processed_events" table
CREATE TABLE "outbox"."processed_events" (
  "event_id" uuid NOT NULL,
  "handler_name" text NOT NULL,
  "processed_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("event_id", "handler_name")
);
