import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyBErh4kgqDsA3XjWb8_13QVAETMzMGhCJM",
  authDomain: "denge-yapi.firebaseapp.com",
  projectId: "denge-yapi",
  storageBucket: "denge-yapi.firebasestorage.app",
  messagingSenderId: "1096532118698",
  appId: "1:1096532118698:web:c892bf0b260a0623be54d3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const data = JSON.parse(fs.readFileSync("./data-backup.json", "utf8"));
  console.log("Found services:", data.services.length, "settings:", data.settings.length);

  // Upload services
  for (const service of data.services) {
    const docId = service.slug || String(service.id);
    await setDoc(doc(db, "services", docId), service);
    console.log(`Uploaded service: ${docId} (${service.title_tr})`);
  }

  // Upload settings
  for (const setting of data.settings) {
    await setDoc(doc(db, "settings", setting.key), setting);
    console.log(`Uploaded setting: ${setting.key}`);
  }

  console.log("All data successfully uploaded to Firestore!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
