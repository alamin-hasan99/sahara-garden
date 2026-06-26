import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "Gourmet Garden | Premium Farm-to-Table E-Commerce",
  description: "Savor premium organic farm-to-table artisan produce, hand-harvested and delivered fresh to your doorstep. Experience the true taste of nature.",
  keywords: "organic, gourmet, farm-to-table, fresh produce, strawberries, honey, avocados, premium grocery",
  authors: [{ name: "Gourmet Garden" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-body bg-[#fcfaf6] text-[#1b1b1a] transition-colors duration-300">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
