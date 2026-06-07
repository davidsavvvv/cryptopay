import PaymentPageClient from "./PaymentPageClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { username } = await params;
  return <PaymentPageClient username={username} />;
}
