import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { Button } from "@reactive-resume/ui/components/button";
import { getRouter } from "./router";
import "./index.css";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

type BootErrorScreenProps = {
	onRetry: () => void;
};

function BootErrorScreen({ onRetry }: BootErrorScreenProps) {
	return (
		<div className="mx-auto flex h-svh max-w-md flex-col items-center justify-center gap-y-4 p-6 text-center">
			<p className="text-muted-foreground text-sm">
				The app could not start. Confirm the API server is running, then try again.
			</p>
			<Button type="button" onClick={onRetry}>
				Try again
			</Button>
		</div>
	);
}

try {
	const router = await getRouter();

	if (!rootElement.innerHTML) {
		const root = ReactDOM.createRoot(rootElement);

		root.render(<RouterProvider router={router} />);
	}
} catch (error) {
	console.error(error);
	const root = ReactDOM.createRoot(rootElement);
	root.render(<BootErrorScreen onRetry={() => window.location.reload()} />);
}
