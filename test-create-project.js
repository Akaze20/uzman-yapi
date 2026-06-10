async function run() {
  try {
    const payload = {
      title_tr: 'Test Projesi TR',
      title_en: 'Test Project EN',
      desc_tr: 'Açıklama TR',
      desc_en: 'Description EN',
      image: '/uploads/1780616891455-test-image.png',
      images: '/uploads/1780616891455-test-image.png'
    };

    const res = await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('CREATE PROJECT RESPONSE STATUS:', res.status);
    console.log('CREATE PROJECT RESPONSE DATA:', data);
  } catch (err) {
    console.error('Test script failed:', err);
  }
}

run();
