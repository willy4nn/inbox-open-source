"use client";

import { ConversationsList } from "@/components/ConversationsList";
import { ChatContainer } from "@/components/ChatContainer";
import { OptionsPanel } from "@/components/OptionsPanel";

export default function Page() {
	return (
		<div className="flex h-screen w-full bg-gray-50">
			<ConversationsList />
			<ChatContainer />
			<OptionsPanel />
		</div>
	);
}
