"use client";
import { useEffect } from "react";

export function useInboxTheme() {
	useEffect(() => {
		async function applyTheme() {
			try {
				const res = await fetch("../../../public/config/whiteLabel.json");
				const theme = await res.json();

				const root = document.documentElement;

				Object.entries(theme.colors).forEach(([group, shades]) => {
					Object.entries(shades as Record<string, string>).forEach(
						([key, value]) => {
							root.style.setProperty(`--${group}-${key}`, value);
						}
					);
				});
			} catch (err) {
				console.error("Erro ao carregar tema do JSON:", err);
			}
		}

		applyTheme();
	}, []);
}
