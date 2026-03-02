export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background neon glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#00e6e6]/5 blur-[80px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-[#ff1a75]/5 blur-[80px]" />
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
