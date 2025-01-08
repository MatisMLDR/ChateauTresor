import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idEnigme = searchParams.get("id_enigme");

  // Vérification du paramètre
  if (!idEnigme || isNaN(Number(idEnigme))) {
    return NextResponse.json(
      { error: "Paramètre id_enigme invalide ou manquant" },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les indices associés à une énigme
    const { data, error } = await supabase
      .from("indice")
      .select("*")
      .eq("id_enigme", parseInt(idEnigme, 10));

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des indices", details: error.message },
        { status: 500 }
      );
    }

    // Aucun indice trouvé
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucun indice trouvé pour l'énigme avec id ${idEnigme}` },
        { status: 404 }
      );
    }

    // Réponse avec les données des indices
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la requête", details: String(err) },
      { status: 500 }
    );
  }
}