const { streamText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const s = await prisma.setting.findUnique({where: {key: 'gemini_api_key'}});
  const google = createGoogleGenerativeAI({ apiKey: s.value });
  try {
    const { text } = await streamText({ model: google('gemini-flash-latest'), prompt: 'hi' });
    console.log('SUCCESS:', text);
  } catch(e) {
    console.log('ERROR:', e.message);
  } finally {
    prisma.$disconnect();
  }
}
main();
