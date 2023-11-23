import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/logo.svg" alt="Lestian" width={500} height={500} priority />
      <div>Lestian Auth</div>
    </main>
  );
}
