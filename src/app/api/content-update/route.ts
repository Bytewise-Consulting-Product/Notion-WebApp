import prisma from "@/config/prisma";

export async function POST(req: Request) {
  const {
    cid,
    pid,
    data,
  }: {
    cid?: string;
    pid: string;
    data: {
      content: string;
      type: string;
      order: number;
    };
  } = await req.json();

  try {
    // check for the pid
    if (!(await prisma.pages.findUnique({ where: { pid: pid } }))) {
      return new Response(
        JSON.stringify({ message: "Page not found", success: false }),
        {
          status: 400,
        }
      );
    }

    // check for the content
    if (cid?.length === 0) {
      // if the content is not present then create a new content
      const response = await prisma.contents.create({
        data: {
          pid: pid,
          type: data.type,
          content: data.content,
          order: data.order,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Updated Successfully",
          cid: response.cid,
          success: true,
        }),
        { status: 200 }
      );
    }

    // if created then update the content
    const response = await prisma.contents.update({
      where: { cid: cid },
      data: {
        pid: pid,
        type: data.type,
        content: data.content,
        order: data.order,
      },
    });

    return new Response(
      JSON.stringify({ cid: response.cid, message: "Updated", success: true }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error: ", err);
    return Response.json({ message: "Error", success: false }, { status: 200 });
  }
}
