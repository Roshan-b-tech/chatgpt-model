import React, { useState } from "react";
import styles from "./Prompt.module.css";
import Image from "next/image";

import Arrow from "../../../public/svgs/Arrow.svg";
import Retry from "../../../public/svgs/Retry.svg";
import Fork from "../../../public/svgs/Fork.svg";
import Stop from "../../../public/svgs/Stop.svg";
import Attach from "../../../public/svgs/Attach.svg";
import Focus from "../../../public/svgs/Focus.svg";

type Props = {
  fork?: boolean;
  error: string;
  block: boolean;
  streaming: boolean;
  handleSend: (text: string, file?: File | null, focus?: string) => void;
  handleCancel: () => void;
  handleRetry: () => void;
  handleFork: () => void;
};

const Prompt = (props: Props) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [focus, setFocus] = useState<string>("");
  const [showFocus, setShowFocus] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && text.trim() !== "") {
      event.preventDefault();
      props.handleSend(text, file, focus);
      setText("");
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      {props.fork ? (
        <div className={styles.forkContainer} onClick={props.handleFork}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Fork Thread</div>
            <div className={styles.retryButton}>
              <Image src={Fork} alt="Fork" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : props.error.length > 0 ? (
        <div className={styles.retryContainer} onClick={props.handleRetry}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Try Again</div>
            <div className={styles.retryButton}>
              <Image src={Retry} alt="Return" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.inputRow}>
            <div className={styles.inputOptions}>
              <div className={styles.option} onClick={() => setShowFocus((v) => !v)}>
                <Image src={Focus} alt="Focus" width={20} height={20} />
                <span className={styles.optionLabel}>Focus</span>
              </div>
              <label className={styles.option} title="Attach image">
                <Image src={Attach} alt="Attach" width={20} height={20} />
                <span className={styles.optionLabel}>Attach</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={props.streaming || props.block}
                />
              </label>
            </div>
            <input
              disabled={props.streaming || props.block}
              placeholder="Ask anything..."
              className={styles.inputText}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleEnter}
            />
            {props.streaming ? (
              <div className={styles.stopButton} onClick={props.handleCancel}>
                <Image src={Stop} alt="Stop" width={24} height={24} />
              </div>
            ) : (
              <div
                className={styles.sendButton}
                style={{
                  opacity: text.length > 0 || file ? 1 : 0.5,
                }}
              >
                <Image
                  src={Arrow}
                  alt="Arrow"
                  width={24}
                  height={24}
                  onClick={() => {
                    if (text.trim() !== "" || file) {
                      props.handleSend(text, file, focus);
                      setText("");
                      setFile(null);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {showFocus && (
            <div className={styles.focusModal}>
              <input
                type="text"
                placeholder="Set focus/topic..."
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className={styles.focusInput}
              />
              <button
                className={styles.focusSetButton}
                onClick={() => setShowFocus(false)}
              >
                Set
              </button>
            </div>
          )}
          {file && (
            <span className={styles.fileName}>{file.name}</span>
          )}
        </div>
      )}
    </>
  );
};

export default Prompt;
