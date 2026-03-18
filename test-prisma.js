const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres:GqgrZVcnGqvceVvcNnFqKFlzYULBtGoJ@yamabiko.proxy.rlwy.net:22648/railway',
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    const s = await prisma.auditSubmission.create({
      data: {
        name: "Test Name",
        email: "test@example.com",
        website: "https://test.com",
      }
    });
    console.log("Success:", s);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
