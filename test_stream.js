const { streamText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const s = await prisma.setting.findUnique({where: {key: 'gemini_api_key'}});
  if (!s || !s.value) return;
  
  const google = createGoogleGenerativeAI({ apiKey: s.value });
  
  console.log("Trying streamText...");
  try {
    const result = await streamText({
      model: google('gemini-flash-latest'),
      prompt: 'Hello, world!',
    });
    console.log("StreamText success, waiting for chunks...");
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log("\nDone!");
  } catch (err) {
    console.error("StreamText error:", err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
