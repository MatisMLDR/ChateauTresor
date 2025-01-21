"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import Loader from '@/components/global/loader';
import { QRCodeCanvas } from 'qrcode.react'; // Utilisation de QRCodeCanvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'next/navigation';

export default function QRCodePage({ params }: { params: { id_equipe: UUID; id: UUID } }) {
  const { id_equipe, id } = useParams(); // Accédez directement à `params`
  const [chasse, setChasse] = useState<Chasse | null>(null);
  const [enigmes, setEnigmes] = useState<any[]>([]);
  const qrCodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const chasseData = await Chasse.readId(id as UUID);
      if (chasseData) {
        setChasse(chasseData);
        await chasseData.loadEnigmes();
        setEnigmes(chasseData.getEnigmes() || []);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < enigmes.length; i++) {
      const qrCodeElement = qrCodeRefs.current[i];
      if (qrCodeElement) {
        const canvas = await html2canvas(qrCodeElement);
        const imgData = canvas.toDataURL('image');
        const imgWidth = pageWidth - 20; // Marge de 10mm de chaque côté
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

        // Ajouter le nom de l'énigme et le code réponse
        pdf.setFontSize(12);
        pdf.text(`Énigme: ${enigmes[i].titre}`, 10, imgHeight + 20);
        pdf.text(`Code réponse: ${enigmes[i].code_reponse}`, 10, imgHeight + 30);
      }
    }

    pdf.save('qr-codes-enigmes.pdf');
  };

  if (!chasse) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">QR Codes des énigmes</h1>
        <div className="flex gap-2">
          <Link href={`/organisateurs/dashboard/${id_equipe}/chasses/${id}`}>
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la chasse
            </Button>
          </Link>
          <Button onClick={handleDownloadPdf}>
            <QrCode className="h-4 w-4 mr-2" />
            Télécharger les QR Codes en PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enigmes.map((enigme, index) => (
          <Card key={enigme.id_enigme}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                {/* Nom de l'énigme en grand et centré */}
                <p className="text-2xl font-bold">{enigme.titre}</p>

                {/* QR code centré */}
                <div
                  id={`qr-code-${index}`}
                  ref={(el) => {
                    if (el) {
                      qrCodeRefs.current[index] = el;
                    }
                  }}
                  className="qr-card flex justify-center"
                >
                  <QRCodeCanvas
                    value={enigme.code_reponse} // Texte à encoder dans le QR code
                    size={150} // Taille du QR code
                    level="H" // Niveau de correction d'erreur (H = High)
                    bgColor="#FFFFFF" // Couleur de fond (blanc)
                    fgColor="#000000" // Couleur du QR code (noir)
                    includeMargin={true} // Ajoute une marge autour du QR code
                    title={`QR Code pour l'énigme: ${enigme.titre}`} // Titre pour l'accessibilité
                  />
                </div>

                {/* Code réponse centré */}
                <p className="text-lg text-gray-500">
                  <span className="font-semibold">CODE :</span> {enigme.code_reponse}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}