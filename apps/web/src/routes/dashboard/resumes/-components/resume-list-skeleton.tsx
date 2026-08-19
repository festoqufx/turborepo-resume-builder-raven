import { Skeleton } from "@reactive-resume/ui/components/skeleton";

type ResumeListSkeletonProps = {
	view: "grid" | "list";
};

export function ResumeListSkeleton({ view }: ResumeListSkeletonProps) {
	if (view === "list") {
		return (
			<div className="flex flex-col gap-y-1" aria-hidden="true">
				{Array.from({ length: 6 }, (_, index) => (
					<Skeleton key={`resume-list-skeleton-${index}`} className="h-12 w-full" />
				))}
			</div>
		);
	}

	return (
		<div
			aria-hidden="true"
			className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
		>
			{Array.from({ length: 8 }, (_, index) => (
				<Skeleton key={`resume-grid-skeleton-${index}`} className="aspect-page w-full rounded-md" />
			))}
		</div>
	);
}
