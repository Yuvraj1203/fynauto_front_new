import {
  Inter,
  Lora,
  Playfair_Display,
  Roboto,
  Roboto_Mono,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
export const playfair = Playfair_Display({ subsets: ["latin"] });
export const mono = Roboto_Mono({ subsets: ["latin"] });
export const serif = Lora({ subsets: ["latin"] }); // for serif
