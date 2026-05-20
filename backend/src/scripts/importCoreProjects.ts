import "dotenv/config";
import fs from "fs";
import prisma from "../lib/prisma";

// const prisma = new PrismaClient();

/**
 * Lädt deine vorbereitete JSON Datei
 */
function loadProjects() {
  const raw = fs.readFileSync("src/data/coreProjects.json", "utf-8");
  return JSON.parse(raw);
}

/**
 * Import Script
 */
async function importProjects() {
  const projects = loadProjects();

  console.log(`📦 Projects found: ${projects.length}`);

  for (const p of projects) {
    try {
      console.log(`➡️ Importing: ${p.name}`);

      await prisma.project.upsert({
        where: {
          slug: p.slug, // wichtig: unique key
        },
        update: {
          name: p.name,
          projectRank: p.projectRank,

          teamSizeMin: p.teamSize.min,
          teamSizeMax: p.teamSize.max,

          estimatedHours: p.estimatedHours,
          xpPoints: p.xpPoints,
          description: p.description,

          oldCore: p.oldCore,
          newCore: p.newCore,
        },
        create: {
          name: p.name,
          slug: p.slug,
          projectRank: p.projectRank,

          teamSizeMin: p.teamSize.min,
          teamSizeMax: p.teamSize.max,

          estimatedHours: p.estimatedHours,
          xpPoints: p.xpPoints,
          description: p.description,

          oldCore: p.oldCore,
          newCore: p.newCore,
        },
      });
    } catch (err) {
      console.error(`❌ Failed for ${p.slug}`, err);
    }
  }

  console.log("✅ Import finished");

  await prisma.$disconnect();
}

importProjects();