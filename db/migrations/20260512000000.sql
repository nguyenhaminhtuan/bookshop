-- Create "book_stats" table
CREATE TABLE "catalog"."book_stats" (
  "book_id" uuid NOT NULL,
  "average_rating" numeric(3,2) NOT NULL DEFAULT 0,
  "total_reviews" integer NOT NULL DEFAULT 0,
  "total_sales" integer NOT NULL DEFAULT 0,
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("book_id"),
  CONSTRAINT "book_stats_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
