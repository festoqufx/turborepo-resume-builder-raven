import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createNoindexFollowMeta } from "@/libs/seo";

export const Route = createFileRoute("/agent")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.session) return { session: context.session };
	},
	head: () => ({
		meta: [createNoindexFollowMeta()],
	}),
});

function RouteComponent() {
	return <Outlet />;
}
