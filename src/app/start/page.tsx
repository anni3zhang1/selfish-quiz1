import OnboardingCarousel from "./OnboardingCarousel";

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <OnboardingCarousel error={error} />;
}
