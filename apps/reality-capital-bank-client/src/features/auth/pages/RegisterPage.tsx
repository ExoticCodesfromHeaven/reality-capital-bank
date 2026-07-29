import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}

      <div className="hidden bg-primary lg:flex flex-col justify-between p-14 text-white">
        <div>
          <img
            src={import.meta.env.VITE_CLOUDINARY_LOGO}
            className="h-14"
            alt="Reality Capital Bank"
          />
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Open Your
            <br />
            Account Today.
          </h1>

          <p className="mt-8 max-w-md text-lg text-slate-300">
            Join Reality Capital Bank and enjoy secure, modern digital banking
            anywhere.
          </p>
        </div>

        <small>© Reality Capital Bank</small>
      </div>

      {/* Right */}

      <div className="flex items-center justify-center bg-slate-50 p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
