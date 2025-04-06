import { PrismaClient } from "@prisma/client";
import { sampleUsersData } from "./sample-data";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: sampleUsersData,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
