// This is a server component that exports generateStaticParams

export function generateStaticParams() {
  // Return all possible category IDs
  return [
    { id: "1" }, // Dietary
    { id: "2" }, // Work
    { id: "3" }, // Learn English and Arabic
  ];
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
