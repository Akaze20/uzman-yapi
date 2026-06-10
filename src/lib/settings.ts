import { prisma } from './prisma';

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error(`Failed to get setting ${key}:`, error);
    return defaultValue;
  }
}

export async function getSettings(keys: Record<string, string>): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const [key, defaultValue] of Object.entries(keys)) {
    result[key] = await getSetting(key, defaultValue);
  }
  return result;
}
