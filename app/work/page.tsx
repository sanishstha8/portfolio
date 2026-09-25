import { redirect } from "next/navigation";

/** /work has no index of its own — the case studies live on the home page. */
export default function WorkIndexPage() {
  redirect("/#work");
}
