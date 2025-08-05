import crypto from "crypto";

const key = process.env.CRYPTO_KEY;
const IV = crypto.randomBytes(16);
function encryption(text) {
  const buffer = Buffer.from(text);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, IV);
  let encrypted = cipher.update(buffer, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return IV.toString("hex")+":"+encrypted;
}

export default encryption;
