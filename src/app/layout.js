import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  icons: {
    icon: "/icon.png", 
  },
  title: "Sahara Garden | Premium Farm-to-Table E-Commerce",
  description: "Savor premium organic farm-to-table artisan produce, hand-harvested and delivered fresh to your doorstep. Experience the true taste of nature.",
  keywords: "organic, Sahara Garden, farm-to-table, fresh produce, strawberries, honey, avocados, premium grocery",
  authors: [{ name: "Al-amin Hasan" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-body bg-body-bg text-text-dark transition-colors duration-300">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

