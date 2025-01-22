import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Footer = ({ type = "participant" }: { type?: "participant" | "organisateur"}) => {
  return (
    <footer
      className="grid bg-primary grid-cols-1 w-full place-items-center gap-2 px-4 py-6 md:px-6 text-white"
      id="footer"
    >
      <Image src={'/logo.svg'} alt={'Logo'} width={64} height={64} />
      <div className="w-9/12 relative py-4">
        <div className="w-full absolute inset-0 flex items-center">
          <div className="w-full border-b border-secondary"></div>
        </div>
        <div className="w-full relative flex justify-center">
          <span className="bg-primary px-4 text-sm">Château Trésor &copy;</span>
        </div>
      </div>

      <div className="flex flex-col max-md:text-center md:flex-row gap-4 text-xs">
        <Link href="/legal/cgu">
          <span className="hover:underline">Conditions générales d&apos;utilisation</span>
        </Link>
        <Link href={type === "organisateur" ? "/" : "/organisateurs"}>
          <span className="hover:underline">{type === "organisateur" ? "Je suis participant" : "Je suis organisateur"}</span>
        </Link>
        <Link href="https://www.internet-signalement.gouv.fr/PharosS1/">
          <span className="hover:underline">Signaler un contenu illicite</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
