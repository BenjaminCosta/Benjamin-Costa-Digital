import Image from "next/image";

/** Official unmodified light-background asset from brand.workana.com. */
export function WorkanaLogo({ className }: Readonly<{ className?: string }>) {
  return <Image src="/images/workana/logo.svg" alt="Workana" width={147} height={24} className={className} />;
}
