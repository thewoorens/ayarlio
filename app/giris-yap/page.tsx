import Image from "next/image";
import {headers} from "next/headers";
import SignInForm from "./SignInForm";

export default async function SignInPage() {
  const headerList = await headers();
  const isVerified = headerList.get("x-email-verified") === "1";

  return (
    <div className="flex min-h-screen w-full bg-background justify-between select-none">
      <div className="mx-auto w-full max-w-md">
        <a href="https://ayarlio.com">
          <Image
            src="/ayarlio-logo.png"
            width={200}
            height={100}
            alt="Ayarlio Logo"
            className="mx-auto mt-5"
            priority
          />
        </a>
        <SignInForm emailVerified={isVerified}/>
      </div>
    </div>
  );
}
