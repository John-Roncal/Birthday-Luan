import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get("codigo");

    if (!codigo) {
      return NextResponse.json(
        { ok: false, message: "Código no proporcionado" },
        { status: 400 }
      );
    }

    const { data: invitado, error } = await supabase
      .from("invitados")
      .select("*")
      .eq("codigo_unico", codigo)
      .single();

    if (error || !invitado) {
      return NextResponse.json(
        { ok: false, message: "Invitado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, invitado });
  } catch (e) {
    console.error("Error en /api/invitado:", e);
    return NextResponse.json(
      { ok: false, message: "Error interno" },
      { status: 500 }
    );
  }
}