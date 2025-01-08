"use client";

import { useState } from "react";
import { ChateauType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data - replace with actual API call
const MOCK_CASTLES: ChateauType[] = [
  {
    id: "1",
    name: "Edinburgh Castle",
    description: "Historic fortress dominating the skyline of Edinburgh, Scotland",
    location: { lat: 55.9486, lng: -3.1999 },
    imageUrl: "https://images.unsplash.com/photo-1580910527739-36f06b8feca3?auto=format&fit=crop&q=80",
    address: "Castlehill, Edinburgh EH1 2NG"
  },
  // Add more castles
];

export function MapComponent() {
  const [selectedCastle, setSelectedCastle] = useState<ChateauType | null>(null);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Replace with actual map implementation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Map will be implemented here</p>
      </div>
      
      {selectedCastle && (
        <Card className="absolute bottom-4 right-4 w-80">
          <CardHeader>
            <CardTitle>{selectedCastle.nom}</CardTitle>
            <CardDescription>{selectedCastle.address_postale}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={selectedCastle.image}
              alt={selectedCastle.nom}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <p className="text-sm text-muted-foreground">
              {selectedCastle.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}