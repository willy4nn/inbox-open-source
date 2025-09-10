"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface ChatMessageProps {
	text: string;
	sender: "human" | "agent";
	timestamp: string;
	username?: string;
	avatarUrl?: string;
}

export const ChatMessage = ({
	text,
	sender,
	timestamp,
	username,
	avatarUrl,
}: ChatMessageProps) => {
	const isHuman = sender === "human";

	return (
		<div
			className={`flex items-start gap-2 ${
				isHuman ? "justify-start" : "justify-end"
			}`}
		>
			{/* Avatar */}
			{isHuman && (
				<Avatar>
					{avatarUrl && <AvatarImage src={avatarUrl} />}
					<AvatarFallback>{username?.[0] ?? "U"}</AvatarFallback>
				</Avatar>
			)}

			{/* Mensagem */}
			<Card
				className={`max-w-sm md:max-w-lg p-2 rounded-lg shadow-sm ${
					isHuman
						? "bg-gray-200 text-gray-900"
						: "bg-blue-500 text-white"
				}`}
			>
				<CardContent className="p-1">
					<p className="text-sm">{text}</p>
					<span className="block text-[10px] opacity-70 mt-1">
						{dayjs(timestamp).fromNow()}
					</span>
				</CardContent>
			</Card>

			{/* Avatar para agente */}
			{!isHuman && (
				<Avatar>
					{avatarUrl && <AvatarImage src={avatarUrl} />}
					<AvatarFallback>{username?.[0] ?? "A"}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
