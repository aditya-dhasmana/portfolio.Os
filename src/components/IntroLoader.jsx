import { useEffect, useState } from "react";

const greetings = [
  "Namaste",
  "Hello",
  "Bonjour",
  "Hola",
  "Ciao",
  "こんにちは"
];

const IntroLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 900); // slower = more premium

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="intro-loader">
      <div key={index} className="intro-text">
        {greetings[index]}
      </div>
    </div>
  );
};

export default IntroLoader;