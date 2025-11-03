"use client";

/**
 * TerminalInput Component
 * Handles command input with history navigation (Arrow Up/Down) and autocomplete (Tab)
 * Submits commands on Enter key press
 */

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { TerminalInputProps } from "@/types/terminal";
import { TERMINAL_PROMPT } from "@/lib/constants";
import styles from "./TerminalInput.module.css";

export function TerminalInput({
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  onAutocomplete,
  placeholder = "Enter command...",
  disabled = false,
}: TerminalInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        // Submit command
        if (inputValue.trim()) {
          onSubmit(inputValue.trim());
          setInputValue("");
        }
        e.preventDefault();
        break;

      case "ArrowUp":
        // Navigate to previous command in history
        const prevCommand = onHistoryUp();
        if (prevCommand !== null) {
          setInputValue(prevCommand);
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.selectionStart = prevCommand.length;
              inputRef.current.selectionEnd = prevCommand.length;
            }
          }, 0);
        }
        e.preventDefault();
        break;

      case "ArrowDown":
        // Navigate to next command in history
        const nextCommand = onHistoryDown();
        if (nextCommand !== null) {
          setInputValue(nextCommand);
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              const len = nextCommand.length;
              inputRef.current.selectionStart = len;
              inputRef.current.selectionEnd = len;
            }
          }, 0);
        }
        e.preventDefault();
        break;

      case "Tab":
        // Autocomplete command
        const matches = onAutocomplete(inputValue.trim());
        if (matches.length === 1) {
          // Single match: autocomplete it
          setInputValue(matches[0] + " ");
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              const len = matches[0].length + 1;
              inputRef.current.selectionStart = len;
              inputRef.current.selectionEnd = len;
            }
          }, 0);
        } else if (matches.length > 1) {
          // Multiple matches: log them (future: show in output)
          console.log("Autocomplete matches:", matches);
        }
        e.preventDefault();
        break;

      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={styles.inputSection}>
      <div className={styles.inputLine}>
        <span className={styles.prompt}>{TERMINAL_PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          className={styles.input}
        />
      </div>
    </div>
  );
}
