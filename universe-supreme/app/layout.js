import "./globals.css";

export const metadata = {
  title: "Universe Supreme",
  description: "Nyabe's private, database-backed personal platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
