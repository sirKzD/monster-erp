import CryptoJS from "crypto-js";

const SECRET_KEY = "KANBAN_SECRET_KEY";

export const encryptData = <T>(data: T): string => {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
    ).toString();
};

export const decryptData = <T>(
    cipherText: string
): T | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(
            cipherText,
            SECRET_KEY
        );

        const decrypted = bytes.toString(
            CryptoJS.enc.Utf8
        );

        if (!decrypted) {
            return null;
        }

        return JSON.parse(decrypted) as T;

    } catch (err) {

        console.error("Decrypt failed:", err);
        return null;
    }
};