import { Trans } from "@lingui/react/macro";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui/components/button";

type DashboardQueryErrorProps = {
	onRetry: () => void;
};

export function DashboardQueryError({ onRetry }: DashboardQueryErrorProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
				<WarningCircleIcon className="size-6 text-muted-foreground" />
			</div>
			<p className="max-w-sm text-muted-foreground text-sm">
				<Trans>Something went wrong while loading this page. Please try again.</Trans>
			</p>
			<Button size="sm" variant="outline" onClick={onRetry}>
				<Trans>Try again</Trans>
			</Button>
		</div>
	);
}
