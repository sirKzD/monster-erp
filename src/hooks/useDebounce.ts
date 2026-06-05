import { useEffect, useState } from "react";

export default function useDebounce<T>(
    value: T,
    delay: number = 500
): T {

    const [debounced, setDebounced] =
        useState<T>(value);

    useEffect(() => {

        const timer = window.setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => {
            window.clearTimeout(timer);
        };

    }, [value, delay]);

    return debounced;
}