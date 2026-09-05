import { addListener, removeListener } from "@/app/modules/occupancy/occupancy-subs";

export async function GET(request: Request, { params }: { params: Promise<{ familyID: string }> }) {
    const { familyID } = await params;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            addListener(familyID, controller);

            const data = encoder.encode("data: hello\n\n");
            const interval = setInterval(() => {
                try {
                    controller.enqueue(data);
                } catch {
                    clearInterval(interval);
                    removeListener(familyID, controller);
                }
            }, 5000);

            request.signal.addEventListener("abort", () => {
                clearInterval(interval);
                removeListener(familyID, controller);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
