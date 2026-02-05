"use client";

const TestError = () => {
  const value = Math.random();

  if (value < 0.5) {
    throw new Error("Testing root layout error");
  }

  return <span>Testing Error</span>;
};

export default TestError;
