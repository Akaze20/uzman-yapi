async function run() {
  try {
    const filename = '1780614999386-negatif-tattoo-tasarim_(8).png';
    const url = `http://localhost:3001/uploads/${filename}`;
    const res = await fetch(url);
    console.log(`FETCH ${url} STATUS:`, res.status);
    console.log(`CONTENT-TYPE:`, res.headers.get('content-type'));
  } catch (err) {
    console.error('Test script failed:', err);
  }
}

run();
