import Link from "next/link";
import Button from ".././components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Resume Creator</h1>
      <div className="flex space-x-4">
        <Link href="/upload">
          <Button>Upload Existing Resume</Button>
        </Link>
        <Link href="/create">
          <Button>Create New Resume</Button>
        </Link>
      </div>
    </main>
  );
}
