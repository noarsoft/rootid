/*
  Warnings:

  - The primary key for the `data_schema` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `modified_date_time` on the `data_schema` table. All the data in the column will be lost.
  - You are about to drop the column `previous_id` on the `data_schema` table. All the data in the column will be lost.
  - You are about to drop the column `root_id` on the `data_schema` table. All the data in the column will be lost.
  - You are about to drop the `data_form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `data_formcfg` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `data_view` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "data_form" DROP CONSTRAINT "data_form_fk_data_schema_fkey";

-- DropForeignKey
ALTER TABLE "data_form" DROP CONSTRAINT "data_form_previous_id_fkey";

-- DropForeignKey
ALTER TABLE "data_formcfg" DROP CONSTRAINT "data_formcfg_fk_data_schema_fkey";

-- DropForeignKey
ALTER TABLE "data_formcfg" DROP CONSTRAINT "data_formcfg_previous_id_fkey";

-- DropForeignKey
ALTER TABLE "data_schema" DROP CONSTRAINT "data_schema_previous_id_fkey";

-- DropForeignKey
ALTER TABLE "data_view" DROP CONSTRAINT "data_view_fk_data_schema_fkey";

-- DropForeignKey
ALTER TABLE "data_view" DROP CONSTRAINT "data_view_previous_id_fkey";

-- DropIndex
DROP INDEX "data_schema_previous_id_idx";

-- AlterTable
ALTER TABLE "data_schema" DROP CONSTRAINT "data_schema_pkey",
DROP COLUMN "modified_date_time",
DROP COLUMN "previous_id",
DROP COLUMN "root_id",
ADD COLUMN     "modify_datetime" VARCHAR(15),
ADD COLUMN     "prev_id" INTEGER,
ADD COLUMN     "rootid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "data_schema_pkey" PRIMARY KEY ("rootid");

-- DropTable
DROP TABLE "data_form";

-- DropTable
DROP TABLE "data_formcfg";

-- DropTable
DROP TABLE "data_view";

-- CreateTable
CREATE TABLE "view" (
    "rootid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "prev_id" INTEGER,
    "data_schema_id" INTEGER NOT NULL,
    "view_type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255),
    "json_table_config" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'draft',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modify_datetime" VARCHAR(15),

    CONSTRAINT "view_pkey" PRIMARY KEY ("rootid")
);

-- CreateTable
CREATE TABLE "form" (
    "rootid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "prev_id" INTEGER,
    "data_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "json_form_config" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'draft',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modify_datetime" VARCHAR(15),

    CONSTRAINT "form_pkey" PRIMARY KEY ("rootid")
);

-- CreateTable
CREATE TABLE "data" (
    "rootid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "prev_id" INTEGER,
    "data_schema_id" INTEGER NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'active',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modify_datetime" VARCHAR(15),

    CONSTRAINT "data_pkey" PRIMARY KEY ("rootid")
);

-- CreateIndex
CREATE UNIQUE INDEX "view_id_key" ON "view"("id");

-- CreateIndex
CREATE INDEX "view_data_schema_id_idx" ON "view"("data_schema_id");

-- CreateIndex
CREATE INDEX "view_view_type_idx" ON "view"("view_type");

-- CreateIndex
CREATE UNIQUE INDEX "form_id_key" ON "form"("id");

-- CreateIndex
CREATE INDEX "form_data_id_idx" ON "form"("data_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_id_key" ON "data"("id");

-- CreateIndex
CREATE INDEX "data_data_schema_id_idx" ON "data"("data_schema_id");

-- CreateIndex
CREATE INDEX "data_activate_idx" ON "data"("activate");

-- CreateIndex
CREATE INDEX "data_schema_prev_id_idx" ON "data_schema"("prev_id");

-- AddForeignKey
ALTER TABLE "data_schema" ADD CONSTRAINT "data_schema_prev_id_fkey" FOREIGN KEY ("prev_id") REFERENCES "data_schema"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "view" ADD CONSTRAINT "view_prev_id_fkey" FOREIGN KEY ("prev_id") REFERENCES "view"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "view" ADD CONSTRAINT "view_data_schema_id_fkey" FOREIGN KEY ("data_schema_id") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_prev_id_fkey" FOREIGN KEY ("prev_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_prev_id_fkey" FOREIGN KEY ("prev_id") REFERENCES "data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_data_schema_id_fkey" FOREIGN KEY ("data_schema_id") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
