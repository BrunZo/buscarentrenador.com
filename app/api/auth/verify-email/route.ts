import { NextRequest, NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: "Token no proporcionado" },
                { status: 400 }
            );
        }

        const result = await verifyUserEmail(token);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Correo verificado exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying email:', error);
        return NextResponse.json(
            { error: "Error interno del servidor. Por favor, intentá de nuevo." },
            { status: 500 }
        );
    }
}
