"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import themeJson from "@/config/whiteLabel.json";

type ThemeName = "light" | "dark";

type ThemeContextType = {
	theme: ThemeName;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<ThemeName>("light");

	useEffect(() => {
		const themeColors = themeJson[theme];

		Object.entries(themeColors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(
				`--${key}`,
				value as string
			);
		});
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<div className={`${theme} w-full h-full`}>{children}</div>
		</ThemeContext.Provider>
	);
}

// Hook para usar em qualquer componente
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
