import "dotenv/config";
import { PrismaClient, FeaturePriority, FeatureStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.app.upsert({
    where: { name: "AI Strategist/Advisor" },
    update: {},
    create: { name: "AI Strategist/Advisor" },
  });

  await prisma.app.upsert({
    where: { name: "eAPM" },
    update: {},
    create: { name: "eAPM" },
  });

  const ai = await prisma.app.findUnique({ where: { name: "AI Strategist/Advisor" } });
  const eapm = await prisma.app.findUnique({ where: { name: "eAPM" } });

  if (ai) {
    await prisma.feature.create({
      data: {
        appId: ai.id,
        title: "Stakeholder Lens mode",
        problem: "Different stakeholders need different answers.",
        user: "CFO/COO/Plant Manager",
        value: "Faster alignment and better decisions.",
        priority: FeaturePriority.P1,
        status: FeatureStatus.IDEA,
      },
    }).catch(() => {});
  }

  if (eapm) {
    await prisma.feature.create({
      data: {
        appId: eapm.id,
        title: "Fitment checker",
        problem: "Users don’t know which part fits their car.",
        user: "Car owners",
        value: "Reduces wrong orders and increases conversion.",
        priority: FeaturePriority.P1,
        status: FeatureStatus.IDEA,
      },
    }).catch(() => {});
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
