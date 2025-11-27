"use client";

import { useRef, useEffect } from "react";

// A textarea that auto-expands to fit content so it never shows a scrollbar
export const AutoResizeTextarea = ({
  value,
  onChange,
  className,
  placeholder,
  style,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} cursor-text`}
      rows={1}
      style={{
        ...style,
        resize: "none",
        overflow: "hidden",
        border: "none",
        outline: "none",
        width: "100%",
        display: "block",
      }}
    />
  );
};

// Simple input for single lines
export const EditableInput = ({
  value,
  onChange,
  className,
  style,
  placeholder,
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} cursor-text`}
      style={{
        ...style,
        border: "none",
        outline: "none",
        width: "100%",
      }}
    />
  );
};
