-- CreateTable
CREATE TABLE "data_schema" (
    "root_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "previous_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "json" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'draft',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modified_date_time" VARCHAR(15),

    CONSTRAINT "data_schema_pkey" PRIMARY KEY ("root_id")
);

-- CreateTable
CREATE TABLE "data_view" (
    "root_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "previous_id" INTEGER,
    "fk_data_schema" INTEGER NOT NULL,
    "view_type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255),
    "json" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'draft',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modified_date_time" VARCHAR(15),

    CONSTRAINT "data_view_pkey" PRIMARY KEY ("root_id")
);

-- CreateTable
CREATE TABLE "data_formcfg" (
    "root_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "previous_id" INTEGER,
    "fk_data_schema" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "json" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'draft',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modified_date_time" VARCHAR(15),

    CONSTRAINT "data_formcfg_pkey" PRIMARY KEY ("root_id")
);

-- CreateTable
CREATE TABLE "data_form" (
    "root_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "previous_id" INTEGER,
    "fk_data_schema" INTEGER NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "flag" VARCHAR(50) DEFAULT 'active',
    "activate" BOOLEAN NOT NULL DEFAULT true,
    "modified_date_time" VARCHAR(15),

    CONSTRAINT "data_form_pkey" PRIMARY KEY ("root_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_schema_id_key" ON "data_schema"("id");

-- CreateIndex
CREATE INDEX "data_schema_flag_idx" ON "data_schema"("flag");

-- CreateIndex
CREATE INDEX "data_schema_previous_id_idx" ON "data_schema"("previous_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_view_id_key" ON "data_view"("id");

-- CreateIndex
CREATE INDEX "data_view_fk_data_schema_idx" ON "data_view"("fk_data_schema");

-- CreateIndex
CREATE INDEX "data_view_view_type_idx" ON "data_view"("view_type");

-- CreateIndex
CREATE UNIQUE INDEX "data_formcfg_id_key" ON "data_formcfg"("id");

-- CreateIndex
CREATE INDEX "data_formcfg_fk_data_schema_idx" ON "data_formcfg"("fk_data_schema");

-- CreateIndex
CREATE UNIQUE INDEX "data_form_id_key" ON "data_form"("id");

-- CreateIndex
CREATE INDEX "data_form_fk_data_schema_idx" ON "data_form"("fk_data_schema");

-- CreateIndex
CREATE INDEX "data_form_activate_idx" ON "data_form"("activate");

-- AddForeignKey
ALTER TABLE "data_schema" ADD CONSTRAINT "data_schema_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "data_schema"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_view" ADD CONSTRAINT "data_view_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "data_view"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_view" ADD CONSTRAINT "data_view_fk_data_schema_fkey" FOREIGN KEY ("fk_data_schema") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_formcfg" ADD CONSTRAINT "data_formcfg_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "data_formcfg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_formcfg" ADD CONSTRAINT "data_formcfg_fk_data_schema_fkey" FOREIGN KEY ("fk_data_schema") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_form" ADD CONSTRAINT "data_form_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "data_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "data_form" ADD CONSTRAINT "data_form_fk_data_schema_fkey" FOREIGN KEY ("fk_data_schema") REFERENCES "data_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
