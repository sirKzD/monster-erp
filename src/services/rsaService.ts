import { generateRSAKeys, encryptRSA, decryptRSA } from "../crypto/rsa";

export async function testRSA(): Promise<void> {
  try {
    const keys = await generateRSAKeys();
    const encrypted = await encryptRSA("HELLO SECURITY 👹", keys.publicKey);
    const decrypted = await decryptRSA(encrypted, keys.privateKey);
    console.log("Encrypted:", encrypted);
    console.log("Decrypted:", decrypted);
    alert(`✅ RSA WORKS:\n${decrypted}`);
  } catch (err) {
    console.error(err);
    alert("RSA FAILED");
  }
}