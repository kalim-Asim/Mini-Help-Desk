import prisma from '../config/db';

const categories = [
  "Network",
  "Cleaning",
  "Carpentry",
  "PC Maintenance",
  "Plumbing",
  "Electricity",
];

const insertCategories = async () => {
  try {
    for (const type_name of categories) {
      await prisma.complaintType.upsert({
        where: { type_name },
        update: {},
        create: { type_name },
      });
    }
    console.log("Complaint types seeded successfully.");
  } catch (err) {
    console.error("Error inserting complaint types:", err);
  } finally {
    await prisma.$disconnect();
  }
};

insertCategories();
