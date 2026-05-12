-- Create "book_authors" table
CREATE TABLE "catalog"."book_authors" (
  "book_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  PRIMARY KEY ("book_id", "author_id"),
  CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "catalog"."authors" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "book_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "book_tags" table
CREATE TABLE "catalog"."book_tags" (
  "book_id" uuid NOT NULL,
  "tag_id" uuid NOT NULL,
  PRIMARY KEY ("book_id", "tag_id"),
  CONSTRAINT "book_tags_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "catalog"."books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "book_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "catalog"."tags" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Drop "books_authors" table
DROP TABLE "catalog"."books_authors";
-- Drop "books_tags" table
DROP TABLE "catalog"."books_tags";
