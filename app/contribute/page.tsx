import ContributeForm from "@/components/contribute/ContributeForm"

export const metadata = {
  title: "Leave a Memory — For Denisha",
  description: "Share a memory, message, or photo for Denisha's birthday.",
}

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-midnight text-cream">
      <ContributeForm />
    </main>
  )
}
