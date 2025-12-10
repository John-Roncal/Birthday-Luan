import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const codigo_unico = String(form.get("codigo_unico") ?? "").trim();
    const respuesta = String(form.get("respuesta") ?? "").trim().toLowerCase();

    if (!codigo_unico || !["si", "no"].includes(respuesta)) {
      return NextResponse.json(
        { ok: false, message: "Datos inválidos" },
        { status: 400 }
      );
    }

    const asistira = respuesta === "si";

    const { error } = await supabase
      .from("invitados")
      .update({ asistira })
      .eq("codigo_unico", codigo_unico);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { ok: false, message: "Error guardando respuesta" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Confirmación registrada",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}