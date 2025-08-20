import Link from 'next/link';
import Image from 'next/image';
export default function Header() {
  return (
    <header className='container mx-auto px-4 py-4 flex items-center justify-between'>
      {/* left: avatar + name */}
      <div className='flex items-center gap-3'>
        <Link href='/' className='inline-flex items-center gap-3'>
          <Image src='/avatar.png' alt='Aditya Singh' width={56} height={56}
                 className='rounded-full border-2 border-blue-400 shadow-md' />
          <div className='leading-tight'>
            <div className='font-semibold text-white'>Aditya Singh</div>
            <div className='text-gray-400 text-sm'>Tech × Finance</div>
          </div>
        </Link>
      </div>

      {/* right: nav (no FX button) */}
      <nav className='flex items-center gap-2'>
        <Link href='#about' className='btn-pill'>About</Link>
        <Link href='#projects' className='btn-pill'>Projects</Link>
        <Link href='#certificates' className='btn-pill'>Certificates</Link>
        <Link href='#achievements' className='btn-pill'>Achievements</Link>
        <Link href='/resume' className='btn-pill'>Resume</Link>
        <Link href='https://deal-lens-ai-ma-screener.vercel.app' target='_blank' className='btn-pill'>DealLens</Link>
        <Link href='#contact' className='btn-pill'>Contact</Link>
      </nav>
    </header>
  );
}
