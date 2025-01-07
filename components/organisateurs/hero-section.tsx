"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Discover Hidden Treasures in Historic Castles
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Embark on exciting treasure hunts in magnificent castles. Solve riddles, follow clues, and uncover secrets while exploring historic landmarks.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/hunts">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Explore Hunts
              </Button>
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}