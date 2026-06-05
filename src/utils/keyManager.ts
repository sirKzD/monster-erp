export const generateKey = (): string => {

    const array = new Uint8Array(32);

    crypto.getRandomValues(array);

    return Array.from(array)
        .map((b) =>
            b.toString(16).padStart(2, "0")
        )
        .join("");
};

export const getUserKey = (
    userId: string
): string => {

    const keyName = `key-${userId}`;

    let key = localStorage.getItem(keyName);

    if (!key) {

        key = generateKey();

        localStorage.setItem(
            keyName,
            key
        );
    }

    return key;
};