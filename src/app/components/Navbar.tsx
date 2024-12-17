import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/uskudar-logo.png" alt="Logo" width={120} height={120} />
          <span className="ml-2 text-white text-xl font-semibold">Çöp Kamyonu Rota Optimizasyonu</span>
        </div>
      </div>
    </nav>
  )
}

