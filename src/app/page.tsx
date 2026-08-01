import { redirect } from "next/navigation";

export default function Home() {
  // next/navigation auto-prefixes basePath (/admin)
  redirect("/dashboard/accounts");
}
