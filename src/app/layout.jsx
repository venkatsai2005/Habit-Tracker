import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Outfit, Poppins, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"], // Specify subsets as needed
  variable: "--font-outfit",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"], // Specify subsets as needed
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"], // Specify subsets as needed
  variable: "--font-inter",
});


export const metadata = {
  title: "Welcome to Habit Tracker",
  description: "Achieve Your New Goals with our Habit Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scrollbar-thin scrollbar-thumb-[#A0FFBA] scrollbar-track-[#263238] ">
      <body className={`${outfit.variable} ${poppins.variable} ${inter.variable} antialiased`}>
        <SpeedInsights />
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{
            // Default options for all toasts
            success: {
              style: {
                border: "1px solid #A0FFBA",
                padding: "10px",
                color: "#fff",
                background: "#333F4E"
              },
              iconTheme: {
                primary: "#A0FFBA",
                secondary: "black",
              },
            },
            error: {
              style: {
                border: "1px solid #FB5456",
                padding: "10px",
                color: "#fff",
                background: "#333F4E",
              },
              iconTheme: {
                primary: "#FB5456",
                secondary: "#FFF",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
