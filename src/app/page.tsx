import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }
  
  // Redirect based on user role
  switch (session.user.role) {
    case "OWNER":
      redirect("/owner")
    case "ADMIN":
      redirect("/admin")
    case "PEKERJA":
      redirect("/worker")
    default:
      redirect("/login")
  }
}
