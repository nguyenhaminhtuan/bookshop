-- Allow root categories
ALTER TABLE "catalog"."categories" ALTER COLUMN "parent_id" DROP NOT NULL;

-- Remove UNPUBLISHED from book.status check constraint
ALTER TABLE "catalog"."books" DROP CONSTRAINT IF EXISTS "books_status_check";
ALTER TABLE "catalog"."books" ADD CONSTRAINT "books_status_check"
  CHECK (status = ANY (ARRAY['DRAFT'::text, 'PUBLISHED'::text, 'DISCONTINUED'::text]));
