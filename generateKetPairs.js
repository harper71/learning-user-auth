import crypto from "crypto";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

function addToCurrentDir(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, fileName)
}

export {
  addToCurrentDir
}

const generatedKey = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  }
});

await fs.writeFile(addToCurrentDir('id_rsa_pub.pem'), generatedKey.publicKey);
await fs.writeFile(addToCurrentDir('id_rsa_priv.pem'), generatedKey.privateKey);
