import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAnswer,
  addMessage,
  updateMessage,
  selectChatThread,
} from "@/store/chatSlice";
import { Chat as ChatType, ChatThread, Message } from "../utils/types";
import { getInitialMessages } from "../utils/utils";
import { selectUserDetailsState } from "@/store/authSlice";
import { selectAI } from "@/store/aiSlice";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../../firebaseConfig";

type UseChatAnswerProps = {
  threadId: string;
  chatThread: ChatThread;
  setError: (error: string) => void;
  setErrorFunction: (fn: Function | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsCompleted: (isCompleted: boolean) => void;
};

const useChatAnswer = ({
  threadId,
  chatThread,
  setError,
  setErrorFunction,
  setIsStreaming,
  setIsLoading,
  setIsCompleted,
}: UseChatAnswerProps) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetailsState);
  const ai = useSelector(selectAI);
  const userId = userDetails.uid;
  // Use useSelector to get the latest chatThread state
  const latestChatThread = useSelector((state: any) => selectChatThread(state, threadId));

  const [controller, setController] = useState<AbortController | null>(null);

  const handleSave = async () => {
    if (userId) {
      try {
        const updatedChatThread = latestChatThread;
        const updatedChats = updatedChatThread?.chats || [];
        const updatedMessages = updatedChatThread?.messages || [];
        if (userId) {
          try {
            const chatThreadRef = doc(db, "users", userId, "history", threadId);
            await setDoc(chatThreadRef, {
              messages: updatedMessages,
              chats: updatedChats,
            }, { merge: true });
          } catch (error) {
            console.error("Error updating chat thread in Firestore:", error);
          }
        }
      } catch (error) {
        console.error("Error updating Firestore DB:", error);
      }
    }
  };

  const handleAnswer = async (chat: ChatType, data?: string) => {
    console.log("[DEBUG] handleAnswer called", { chat, data });
    setIsLoading(true);
    setIsCompleted(false);
    const newController = new AbortController();
    setController(newController);

    let messages = getInitialMessages(chat, data);
    try {
      console.log("[DEBUG] About to send POST request to /api/chat", { messages, model: chat?.mode === "image" ? "gpt-4o" : ai.model });
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          model: chat?.mode === "image" ? "gpt-4o" : ai.model,
          temperature: ai.temperature,
          max_tokens: ai.maxLength,
          top_p: ai.topP,
          frequency_penalty: ai.frequency,
          presence_penalty: ai.presence,
        }),
        signal: newController.signal,
      });
      console.log("[DEBUG] /api/chat response status:", response.status);

      if (!response.ok) {
        setError("Something went wrong. Please try again later.");
        setErrorFunction(() => handleAnswer.bind(null, chat, data));
        return;
      }

      setIsLoading(false);
      if (response.body) {
        setError("");
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        while (true) {
          const { value, done } = await reader.read();
          const text = decoder.decode(value);
          answer += text;
          dispatch(
            updateAnswer({
              threadId,
              chatIndex: chatThread.chats.length - 1,
              answer: answer,
            })
          );
          if (done) {
            break;
          }
        }
        dispatch(
          addMessage({
            threadId,
            message: { role: "assistant", content: answer },
          })
        );
        setIsStreaming(false);
        setIsCompleted(true);
        handleSave();
      }
    } catch (error) {
      setIsLoading(false);
      setIsStreaming(false);
      setIsCompleted(true);
      if ((error as Error).name === "AbortError") {
        await handleSave();
        return;
      }
      setError("Something went wrong. Please try again later.");
      setErrorFunction(() => handleAnswer.bind(null, chat, data));
    } finally {
      setController(null);
    }
  };

  const handleRewrite = async () => {
    setIsLoading(true);
    setIsCompleted(false);
    const newController = new AbortController();
    setController(newController);

    const lastChat = chatThread.chats[chatThread.chats.length - 1];
    const lastUserMessage = chatThread.messages.findLast(
      (message) => message.role === "user"
    );

    if (!lastChat.answer) {
      return;
    }

    const messages: Message[] = [];
    const systemMessage = chatThread.messages.find(
      (message) => message.role === "system"
    );
    if (systemMessage) {
      messages.push(systemMessage);
    }
    chatThread.chats.slice(0, -1).forEach((prevChat) => {
      messages.push({ role: "user", content: prevChat.question });
      if (prevChat.answer) {
        messages.push({ role: "assistant", content: prevChat.answer });
      }
    });

    messages.push({
      role: "user",
      content: lastUserMessage?.content ?? lastChat.question,
    });

    if (ai.customPrompt.length > 0) {
      messages.splice(messages.length - 1, 0, {
        role: "system",
        content: ai.customPrompt,
      });
    }

    try {
      console.log("[DEBUG] About to send POST request to /api/chat (rewrite)", { messages, model: lastChat.mode === "image" ? "gpt-4o" : ai.model });
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          model: lastChat.mode === "image" ? "gpt-4o" : ai.model,
          temperature: ai.temperature,
          max_tokens: ai.maxLength,
          top_p: ai.topP,
          frequency_penalty: ai.frequency,
          presence_penalty: ai.presence,
        }),
        signal: newController.signal,
      });

      if (!response.ok) {
        setError("Something went wrong. Please try again later.");
        setErrorFunction(() => handleRewrite);
        return;
      }

      setIsLoading(false);
      if (response.body) {
        setError("");
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        while (true) {
          const { value, done } = await reader.read();
          const text = decoder.decode(value);
          answer += text;
          dispatch(
            updateAnswer({
              threadId,
              chatIndex: chatThread.chats.length - 1,
              answer: answer,
            })
          );
          if (done) {
            break;
          }
        }
        const lastAssistantMessageIndex = chatThread.messages.findLastIndex(
          (message) => message.role === "assistant"
        );

        if (lastAssistantMessageIndex !== -1) {
          dispatch(
            updateMessage({
              threadId,
              messageIndex: lastAssistantMessageIndex,
              message: { role: "assistant", content: answer },
            })
          );
        }
        setIsStreaming(false);
        setIsCompleted(true);
        handleSave();
      }
    } catch (error) {
      setIsLoading(false);
      setIsStreaming(false);
      setIsCompleted(true);
      if ((error as Error).name === "AbortError") {
        await handleSave();
        return;
      }
      setError("Something went wrong. Please try again later.");
      setErrorFunction(() => handleRewrite);
    } finally {
      setController(null);
    }
  };

  const handleCancel = () => {
    if (controller) {
      controller.abort();
      setIsStreaming(false);
    }
  };

  return {
    handleAnswer,
    handleRewrite,
    handleCancel,
  };
};

export default useChatAnswer;
