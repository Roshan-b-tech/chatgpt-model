"use client";

import Chat from "@/components/Chat/Chat";
import AuthWrapper from "../../AuthWrapper";

type Props = {
  params: { id: string };
};

const ChatPage = ({ params }: Props) => {
  return (
    <AuthWrapper>
      <Chat id={params.id} />
    </AuthWrapper>
  );
};

export default ChatPage;
