import { streamText, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getSetting, getServices } from '@/lib/firestore';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('RECEIVED MESSAGES:', JSON.stringify(messages, null, 2));

    // Fetch API key from Firestore settings
    const settingKey = await getSetting('gemini_api_key', '');
    const apiKey = settingKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Yapay Zeka asistanı henüz yapılandırılmadı. Lütfen Admin panelinden API anahtarını girin.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    // Fetch dynamic services context from Firestore
    const services = await getServices();

    const servicesContext = services
      .map(
        (s) =>
          `Hizmet: ${s.title_tr}\nAçıklama: ${s.desc_tr}\nÖzellikler: ${s.features_tr}`
      )
      .join('\n\n');

    const systemPrompt = `Sen Denge Yapı (Uzman YP) şirketinin resmi yapay zeka müşteri asistanısın. 
Görevin, potansiyel müşterilere Denge Yapı'nın hizmetleri hakkında kibar, profesyonel ve kısa cevaplar vermektir.

Şirketimizin Aktif Hizmetleri:
${servicesContext}

Kurallar:
1. Müşteriye daima saygılı ve yardımsever yaklaş. 
2. Sorulara çok uzun destanlar yazmak yerine, net ve kısa (1-3 cümle) cevaplar ver. 
3. Fiyat sorulduğunda veya çok spesifik teknik detaylar istendiğinde ASLA net bir fiyat verme. "Projeye ve ölçülere göre fiyatlarımız değişiklik göstermektedir, detaylı fiyatlandırma için lütfen iletişim sayfamızdan veya WhatsApp üzerinden uzman ekibimizle görüşün." şeklinde yönlendir.
5. Konuşmayı her zaman yapıcı bir şekilde sonlandır.
6. Eğer kullanıcıya hizmetlerimizden bahsediyorsan veya hizmetlerimizi anlatıyorsan, mesajının en sonuna tam olarak şu etiketi ekle: [LINK_SERVICES]
7. Eğer kullanıcı sana nasıl ulaşabileceğini, iletişim bilgilerini, adresi veya telefonu soruyorsa, mesajının en sonuna tam olarak şu etiketi ekle: [LINK_CONTACT]`;

    const result = await streamText({
      model: google('gemini-flash-latest'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      temperature: 0.3,
    });

    return result.toUIMessageStreamResponse({
      onError: (err) => {
        console.error('Yapay Zeka Akış Hatası:', err);
        return 'Bağlantı sırasında bir hata oluştu veya çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.';
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Bilinmeyen bir hata oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
