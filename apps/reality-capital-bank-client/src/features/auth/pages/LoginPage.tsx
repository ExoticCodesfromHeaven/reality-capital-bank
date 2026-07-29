import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}

      <div className="hidden bg-primary lg:flex flex-col justify-between p-14 text-white">
        <div>
          <img src={import.meta.env.VITE_CLOUDINARY_LOGO} className="h-14" />
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Secure Banking
            <br />
            Made Simple.
          </h1>

          <p className="mt-8 max-w-md text-lg text-slate-300">
            Transfer money instantly. Manage investments. Bank with confidence.
          </p>
        </div>

        <small>© Reality Capital Bank</small>
      </div>

      {/* Right */}

      <div className="flex items-center justify-center bg-slate-50 p-8">
        <LoginForm />
      </div>
    </div>
  );
}
