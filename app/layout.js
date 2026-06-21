import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "Ehtisham — MERN Stack Developer",

  description: "Portfolio of a MERN stack developer — projects, experience, and contact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>

    </html>
  );
}
