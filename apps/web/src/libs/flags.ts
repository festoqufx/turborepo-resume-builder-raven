import type { FeatureFlags } from "@reactive-resume/api/features/flags";
import { client } from "./orpc/client";

export const fallbackFeatureFlags: FeatureFlags = {
	disableSignups: false,
	disableEmailAuth: false,
	showSponsors: false,
	smtpEnabled: false,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
	try {
		return await client.flags.get();
	} catch {
		return fallbackFeatureFlags;
	}
}
