import "../styles/scss/globals.scss";
import "./globals.css";

import { Chivo_Mono } from 'next/font/google'

const font = Chivo_Mono({
  subsets: ['latin']
})

export const metadata = {
  title: "Is This AI?",
  description: "You read two articles, one from Wikipedia and one from AI. Can you tell which is which?",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font.className} data-bs-theme="dark">
      <body>
        <p className="text-center">
          Is This AI | <a href={"/play"}>play</a> · <a href={"https://github.com/matrndev/isthisai/blob/main/README.md"}>learn more</a> · <a href={"/suggest"}>suggest topic</a> · <a href={"https://github.com/matrndev/isthisai"}>github</a>
        </p>
        {children}
      </body>
    </html>
  );
}
