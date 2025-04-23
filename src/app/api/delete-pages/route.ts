import prisma from "@/config/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const SearchParams = req.nextUrl.searchParams;
  const pid = SearchParams.get("pid") as string;

  try {
    // find the pages
    if (await prisma.pages.findUnique({ where: { pid: pid } })) {
      await prisma.contents.deleteMany({ where: { pid: pid } });

      if (await prisma.pages.delete({ where: { pid: pid } })) {
        return new Response(
          JSON.stringify({ message: "Deleted Successfully", success: true }),
          {
            status: 200,
          }
        );
      }
    }

    // if pages not found or not deleted
    return new Response(JSON.stringify({ message: "ERROR", success: false }), {
      status: 400,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err, success: false }), {
      status: 400,
    });
  }
}
