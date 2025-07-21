import React, { memo, useCallback } from "react";
import styles from "./Answer.module.css";
import Image from "next/image";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Skeleton } from "@nextui-org/skeleton";
import { Citation } from "@/utils/types";

import Logo from "../../../public/Logo.svg";

type Props = {
  error: string;
  answer: string;
  isLoading: boolean;
  citations: Citation[];
};

const getDisplayAnswer = (answer: any) => {
  if (typeof answer === "string") {
    return answer;
  }
  if (Array.isArray(answer)) {
    // If it's an array of objects with key '0' or similar
    return answer.map(item => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        // Try to join all values in the object
        return Object.values(item).join(" ");
      }
      return String(item);
    }).join(" ");
  }
  if (typeof answer === "object" && answer !== null) {
    // If it's an object with all keys '0' or similar
    return Object.values(answer).join(" ");
  }
  return String(answer);
};

const Answer = (props: Props & { fileInfo?: { url: string; name: string } }) => {
  const transform = (text: string) => {
    let transformedText = text.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$");

    transformedText = transformedText
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");

    transformedText = transformedText
      .split(/\[\{(\d+)\}\]/)
      .map((part, index) => {
        if (index % 2 === 0) {
          return part;
        } else {
          const citationNumber = parseInt(part);
          const citation = props.citations.find(
            (c) => c.number === citationNumber
          );
          return citation
            ? `<a href="${citation.url}" target="_blank" className="${styles.citations}" >${citationNumber}</a>`
            : part;
        }
      })
      .join("");

    return transformedText;
  };

  return (
    <div className={styles.answerContainer}>
      <div className={styles.answerTextRow}>
        <Image src={Logo} alt="Omniplex" className={styles.answerImg} />
        <p className={styles.answerText}>Answer</p>
      </div>
      {/* Show image if fileInfo is present */}
      {props.fileInfo?.url && (
        <div className={styles.answerImageContainer}>
          <Image src={props.fileInfo.url} alt={props.fileInfo.name || "Attachment"} width={320} height={320} style={{ objectFit: "contain", borderRadius: 8 }} />
        </div>
      )}
      {props.isLoading ? (
        <div>
          <Skeleton className={styles.skeletonAnswer} />
          <Skeleton className={styles.skeletonAnswer} />
          <Skeleton className={styles.skeletonAnswer} />
        </div>
      ) : (
        <div className="prose dark:prose-invert break-words prose-p:p-0 prose-pre:p-0 prose-code:m-0">
          <Markdown
            className={styles.answer}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={dark}
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={{
                      margin: 0,
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={styles.code}>{children}</code>
                );
              },
            }}
          >
            {props.error.length > 0 ? props.error : transform(getDisplayAnswer(props.answer))}
          </Markdown>
        </div>
      )}
    </div>
  );
};

export default memo(Answer);
