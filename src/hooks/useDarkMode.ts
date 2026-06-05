import { useEffect, useState } from "react";

interface UseDarkModeReturn {
    darkMode: boolean;
    setDarkMode: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function useDarkMode():
    UseDarkModeReturn {

    const [darkMode, setDarkMode] =
        useState<boolean>(false);

    useEffect(() => {

        const saved =
            localStorage.getItem("darkMode");

        if (saved === "true") {
            setDarkMode(true);
        }

    }, []);

    useEffect(() => {

        localStorage.setItem(
            "darkMode",
            String(darkMode)
        );

        document.body.classList.toggle(
            "dark",
            darkMode
        );

    }, [darkMode]);

    return {
        darkMode,
        setDarkMode
    };
}