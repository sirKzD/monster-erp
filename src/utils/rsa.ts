function arrayBufferToBase64(
    buffer: ArrayBuffer
): string {

    return btoa(
        String.fromCharCode(
            ...new Uint8Array(buffer)
        )
    );
}

function base64ToArrayBuffer(
    base64: string
): ArrayBuffer {

    return Uint8Array.from(
        atob(base64),
        (c) => c.charCodeAt(0)
    ).buffer;
}

export interface RSAKeyPairResult {
    publicKey: string;
    privateKey: string;
}

export const generateRSAKeys =
async (): Promise<RSAKeyPairResult> => {

    const keyPair =
        await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent:
                    new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );

    const publicKeyBuffer =
        await crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        );

    const privateKeyBuffer =
        await crypto.subtle.exportKey(
            "pkcs8",
            keyPair.privateKey
        );

    return {
        publicKey:
            arrayBufferToBase64(
                publicKeyBuffer
            ),
        privateKey:
            arrayBufferToBase64(
                privateKeyBuffer
            )
    };
};

export const importPublicKey =
async (
    publicKeyBase64: string
): Promise<CryptoKey> => {

    const binary =
        base64ToArrayBuffer(
            publicKeyBase64
        );

    return await crypto.subtle.importKey(
        "spki",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );
};

export const importPrivateKey =
async (
    privateKeyBase64: string
): Promise<CryptoKey> => {

    const binary =
        base64ToArrayBuffer(
            privateKeyBase64
        );

    return await crypto.subtle.importKey(
        "pkcs8",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
};

export const encryptRSA =
async (
    text: string,
    publicKeyBase64: string
): Promise<string> => {

    const publicKey =
        await importPublicKey(
            publicKeyBase64
        );

    const encoded =
        new TextEncoder().encode(text);

    const encrypted =
        await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            encoded
        );

    return arrayBufferToBase64(
        encrypted
    );
};

export const decryptRSA =
async (
    cipherBase64: string,
    privateKeyBase64: string
): Promise<string> => {

    const privateKey =
        await importPrivateKey(
            privateKeyBase64
        );

    const binary =
        base64ToArrayBuffer(
            cipherBase64
        );

    const decrypted =
        await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            binary
        );

    return new TextDecoder().decode(
        decrypted
    );
};