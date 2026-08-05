ALTER TABLE "Post" ADD COLUMN "searchVector" tsvector;

-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "status" "SkillStatus" NOT NULL,
    "searchVector" tsvector NOT NULL,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "demoUrl" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "searchVector" tsvector NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE INDEX "Skill_slug_idx" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- extract text from json
CREATE OR REPLACE FUNCTION extract_text_from_jsonb(data JSONB)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT COALESCE(
        string_agg(
            trim(both '"' from value::text),
            ' '
        ),''
    )
    FROM jsonb_path_query(data, '$.**.text') AS value
$$;

-- Update Post Search Function 
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER

AS $$
    BEGIN 
        NEW.searchVector := to_tsvector(
            'simple',
            COALESCE(NEW.title, '')|| 
            ' '||
            extract_text_from_jsonb(NEW.content)
        );
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

-- Update SKill Search Function 
CREATE OR REPLACE FUNCTION update_skill_search_vector()
RETURNS TRIGGER

AS $$
    BEGIN 
        NEW.searchVector := to_tsvector(
            'simple',
            COALESCE(NEW.title, '')||
            ' '||
            COALESCE(NEW.description, '')||
            ' '||
            extract_text_from_jsonb(NEW.content)
        );
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

-- Update Project Search Function 
CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER

AS $$
    BEGIN 
        NEW.searchVector := to_tsvector(
            'simple',
            COALESCE(NEW.title, '')|| 
            ' '||
            COALESCE(NEW.description, '')||
            ' '||
            extract_text_from_jsonb(NEW.content)
        );
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

-- POST TRIGGER
CREATE TRIGGER post_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, content
ON "Post"
FOR EACH ROW
EXECUTE FUNCTION update_post_search_vector();

-- SKILL TRIGGER
CREATE TRIGGER skill_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, content
ON "Skill"
FOR EACH ROW
EXECUTE FUNCTION update_skill_search_vector();

-- PROJECT TRIGGER
CREATE TRIGGER project_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, content
ON "Project"
FOR EACH ROW
EXECUTE FUNCTION update_project_search_vector();

-- GIN 
CREATE INDEX post_search_vector_gin
ON "Post"
USING GIN ("searchVector");

CREATE INDEX skill_search_vector_gin
ON "Skill"
USING GIN ("searchVector");

CREATE INDEX project_search_vector_gin
ON "Project"
USING GIN ("searchVector");