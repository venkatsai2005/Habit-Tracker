import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    if (!cookieStore) {
      return new Response(
        JSON.stringify({ message: "No cookies found." }),
        { status: 400 }
      );
    }

    await cookieStore.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
    });

    return new Response(
      JSON.stringify({ message: "Logout successful!" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Logout Route Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to logout." }),
      { status: 500 }
    );
  }
}
