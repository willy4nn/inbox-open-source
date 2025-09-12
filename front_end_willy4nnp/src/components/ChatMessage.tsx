"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

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

	const textColor = isHuman ? "text-[var(--foreground-50)]" : "text-white";
	const bgClass = isHuman
		? "bg-[var(--background-600)] border-[var(--background-700)]"
		: "bg-[var(--primary-500)] border-[var(--primary-600)]";

	const mdComponents: Record<string, any> = {
		p: ({ node, ...props }: any) => (
			<p className={`text-sm leading-relaxed ${textColor}`} {...props} />
		),
		a: ({ node, ...props }: any) => (
			<a
				className={`${textColor} underline break-words`}
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			/>
		),
		ul: ({ node, ...props }: any) => (
			<ul
				className={`list-disc ml-5 space-y-1 ${textColor}`}
				{...props}
			/>
		),
		ol: ({ node, ...props }: any) => (
			<ol
				className={`list-decimal ml-5 space-y-1 ${textColor}`}
				{...props}
			/>
		),
		li: ({ node, ...props }: any) => (
			<li className={`${textColor} ml-2`} {...props} />
		),
		strong: ({ node, ...props }: any) => (
			<strong className={`${textColor} font-semibold`} {...props} />
		),
		em: ({ node, ...props }: any) => (
			<em className={`${textColor} italic`} {...props} />
		),
		code: ({ node, inline, className, children, ...props }: any) =>
			inline ? (
				<code
					className={`px-1 rounded text-[0.85em] ${
						isHuman
							? "bg-[var(--background-700)]"
							: "bg-[rgba(255,255,255,0.08)]"
					} ${textColor}`}
					{...props}
				>
					{children}
				</code>
			) : (
				<pre
					className={`p-2 rounded overflow-auto text-sm ${
						isHuman
							? "bg-[var(--background-700)]"
							: "bg-[rgba(255,255,255,0.06)]"
					} ${textColor}`}
				>
					<code>{children}</code>
				</pre>
			),
		img: ({ node, ...props }: any) => (
			<img
				{...props}
				alt={props.alt || ""}
				loading="lazy"
				className="inline-block max-w-full rounded-md align-middle mt-1"
			/>
		),
	};

	return (
		<div
			className={`flex items-start gap-2 ${
				isHuman ? "justify-start" : "justify-end"
			}`}
		>
			{isHuman && (
				<Avatar>
					{avatarUrl && <AvatarImage src={avatarUrl} />}
					<AvatarFallback>{username?.[0] ?? "U"}</AvatarFallback>
				</Avatar>
			)}

			<Card
				className={`max-w-sm md:max-w-lg p-2 rounded-lg shadow-sm ${bgClass}`}
			>
				<CardContent className="p-1">
					<div className="max-w-none break-words">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={mdComponents}
						>
							{text}
						</ReactMarkdown>
					</div>
					<span
						className={`block text-[10px] opacity-70 mt-1 ${
							isHuman
								? "text-[var(--foreground-300)]"
								: "text-[var(--primary-100)]"
						}`}
					>
						{dayjs(timestamp).fromNow()}
					</span>
				</CardContent>
			</Card>

			{!isHuman && (
				<Avatar>
					{avatarUrl && <AvatarImage src={avatarUrl} />}
					<AvatarFallback>{username?.[0] ?? "A"}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
