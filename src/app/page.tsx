import Image from "next/image";
export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Image src="/logo.svg" alt="Lestian" width="100" height="100" />
    </div>
  );
}
