"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import themeJsonRaw from "@/config/whiteLabel.json";

// Tipagem para cores do tema
type ThemeColors = Record<string, string>;

// Tipagem do JSON de whitelabel
type WhiteLabelConfig = {
	inboxName: string;
	logoUrl: string;
	theme: {
		light: ThemeColors;
		dark: ThemeColors;
	};
};

const themeJson = themeJsonRaw as WhiteLabelConfig;

// Nome do tema
type ThemeName = "light" | "dark";

// Contexto
type ThemeContextType = {
	theme: ThemeName;
	toggleTheme: () => void;
	inboxName: string;
	logoUrl: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<ThemeName>("light");

	// Aplica cores do JSON
	useEffect(() => {
		const themeColors = themeJson.theme[theme];

		Object.entries(themeColors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${key}`, value);
		});
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme,
				inboxName: themeJson.inboxName,
				logoUrl: themeJson.logoUrl,
			}}
		>
			<div className={`${theme} w-full h-full`}>{children}</div>
		</ThemeContext.Provider>
	);
}

// Hook para acessar o tema e infos do inbox
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
