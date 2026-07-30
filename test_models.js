const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const s = await prisma.setting.findUnique({where: {key: 'gemini_api_key'}});
  if (!s || !s.value) return;
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + s.value);
  const json = await res.json();
  console.log(json.models.map(m => m.name).join('\n'));
}

main().catch(console.error).finally(() => prisma.$disconnect());
