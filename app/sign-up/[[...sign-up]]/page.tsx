import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">Sign Up</h1>
          <p className="text-gray-600">
            Create your account to save and showcase your crafted components
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-black hover:bg-gray-800",
              footerActionLink: "text-black hover:text-gray-800",
            },
          }}
          redirectUrl="/"
          afterSignInUrl="/"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
}
