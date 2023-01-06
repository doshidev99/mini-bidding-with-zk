export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <div>Header</div>
      <body>{children}</body>
      <footer>Footer</footer>
    </html>
  );
}
