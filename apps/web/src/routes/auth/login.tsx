import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/login";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	beforeLoad: () => {
		throw redirect({ to: "/dashboard", replace: true });
	},
});

function RouteComponent() {
	const { flags } = Route.useRouteContext();

	return <LoginPage disableEmailAuth={flags.disableEmailAuth} disableSignups={flags.disableSignups} />;
}
