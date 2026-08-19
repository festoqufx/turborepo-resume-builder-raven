import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/pages/register";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	beforeLoad: () => {
		throw redirect({ to: "/dashboard", replace: true });
	},
});

function RouteComponent() {
	const { flags } = Route.useRouteContext();

	return <RegisterPage disableEmailAuth={flags.disableEmailAuth} />;
}
