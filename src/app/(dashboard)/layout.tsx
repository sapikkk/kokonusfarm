import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar userRole={session.user.role} />
      <div className="flex flex-col">
        <Header userName={session.user.name} userRole={session.user.role} />
        <main className="flex-1 p-4 lg:p-6 custom-scrollbar overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
