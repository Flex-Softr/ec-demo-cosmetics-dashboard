import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <h1>Dashboard Home page</h1>
    </div>
  );
}
