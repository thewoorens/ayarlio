import SignUpForm from "@/app/kayit-ol/SignUpForm";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full bg-background justify-between select-none">
      <div className="mx-auto">
        <a href={"https://ayarlio.com"}>
          <Image
            src="/ayarlio-logo.png"
            width="200"
            height="100"
            alt="Ayarlio Logo"
            className={"mx-auto hidden md:block mt-5"}
            loading="eager"
            style={{ width: "auto", height: "auto" }}
          />
        </a>
        <SignUpForm />
      </div>
    </div>
  );
}
