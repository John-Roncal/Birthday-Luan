import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ID del invitado no proporcionado" },
        { status: 400 }
      );
    }

    // Actualizar el campo mensaje_enviado a true
    const { error } = await supabase
      .from("invitados")
      .update({ 
        mensaje_enviado: true,
        fecha_envio: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { ok: false, message: "Error al actualizar estado de envío" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Estado de envío actualizado correctamente",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}