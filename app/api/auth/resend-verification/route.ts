import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken } from "@/lib/auth/verification_tokens";
import { getUserByEmail } from "@/lib/auth/users";
import { sendVerificationEmail } from "@/lib/auth/email";
import { z } from "zod";

const resendSchema = z.object({
    email: z.string().email({ message: "El correo electrónico no es válido" }),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = resendSchema.parse(body);

        // Get user to check if exists and get name
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: "No existe una cuenta con este correo electrónico" },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.email_verified) {
            return NextResponse.json(
                { error: "El correo ya está verificado" },
                { status: 400 }
            );
        }

        // Generate new token
        const result = await generateVerificationToken(email);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        // Send verification email
        const emailResult = await sendVerificationEmail({
            email: user.email,
            name: user.name,
            token: result.token!,
        });

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error);
            return NextResponse.json(
                { error: "Error al enviar el correo de verificación. Por favor, intentá de nuevo más tarde." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Correo de verificación enviado exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
            return NextResponse.json(
                { error: firstError },
                { status: 400 }
            );
        }

        console.error('Error resending verification email:', error);
        return NextResponse.json(
            { error: "Error interno del servidor. Por favor, intentá de nuevo." },
            { status: 500 }
        );
    }
}
