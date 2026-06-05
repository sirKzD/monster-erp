import type {
    EncryptedPayload
} from "./encrypt";

export async function decryptData<T>(
    payload: EncryptedPayload,
    secretKey: string
): Promise<T | null> {

    try {

        const key =
            await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(
                    secretKey
                ),
                {
                    name: "AES-GCM"
                },
                false,
                ["decrypt"]
            );

        const decrypted =
            await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: new Uint8Array(
                        payload.iv
                    )
                },
                key,
                new Uint8Array(
                    payload.data
                )
            );

        return JSON.parse(
            new TextDecoder().decode(
                decrypted
            )
        ) as T;

    } catch (err) {

        console.error(
            "Decrypt failed:",
            err
        );

        return null;
    }
}