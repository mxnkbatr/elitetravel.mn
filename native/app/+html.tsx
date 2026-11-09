import { ScrollViewStyleReset } from "expo-router/html";
import type { ReactNode } from "react";

/** Keeps the first web paint on the same brand color as the native splash. */
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" style={{ backgroundColor: "#0b241d" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: "html,body{background:#0b241d;height:100%}" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
