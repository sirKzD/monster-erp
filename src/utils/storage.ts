const STORAGE_KEY = "kanban_v1";

export interface StoragePayload<T> {
    version: number;
    timestamp: number;
    columns: T;
}

export const loadData = <T>():
    StoragePayload<T> | null => {

    try {

        const raw =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!raw) {
            return null;
        }

        const parsed =
            JSON.parse(raw);

        if (!parsed.columns) {
            return null;
        }

        return parsed;

    } catch (err) {

        console.error(
            "Storage corrupt:",
            err
        );

        return null;
    }
};

export const saveData = <T>(
    data: T
): void => {

    try {

        const payload = {
            version: 1,
            timestamp: Date.now(),
            columns: data
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(payload)
        );

    } catch (err) {

        console.error(
            "Failed save:",
            err
        );
    }
};