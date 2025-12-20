import "aos/dist/aos.css";
export const metadata = {
  title: "Coffee Shop",
  description: "Coffee shop landing page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" precedence="default" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" precedence="default" />
        <link rel="stylesheet" href="/css/style.css" precedence="default" />
      </head>
      <body>{children}</body>
    </html>
  );
}
