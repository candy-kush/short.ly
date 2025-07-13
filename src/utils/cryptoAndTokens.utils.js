const { subtle } = require("crypto").webcrypto;

const hashUrl = async (url, salt = "") => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(url + salt);
    const buffer = await subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("error occured in hashUrl: ", error);
    throw new AppError(500, "Something went wrong");
  }
};

const getShortCode = (hash, length = 6) => {
  return hash.slice(0, length);
};

module.exports = {
  hashUrl,
  getShortCode,
};
