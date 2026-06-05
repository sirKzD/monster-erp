export interface EncryptedPayload {
    iv: number[];
    data: number[];
}

export async function encryptData<T>(
    data: T,
    secretKey: string
): Promise<EncryptedPayload> {

    const encoded =
        new TextEncoder().encode(
            JSON.stringify(data)
        );

    const iv =
        crypto.getRandomValues(
            new Uint8Array(12)
        );

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
            ["encrypt"]
        );

    const encrypted =
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            encoded
        );

    return {
        iv: Array.from(iv),
        data: Array.from(
            new Uint8Array(encrypted)
        )
    };
}