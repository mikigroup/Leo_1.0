import type {
	MenuVersion,
	VersionChange,
	ChangeType,
	MenuVersionField
} from '$lib/types/menu';

export function compareVersions(oldVersion: MenuVersion, newVersion: MenuVersion): VersionChange[] {
	const changes: VersionChange[] = [];

	// Definujeme pole jako MenuVersionField[]
	const compareFields: MenuVersionField[] = ['soup', 'active', 'notes', 'type', 'nutri'];

	for (const field of compareFields) {
		if (oldVersion[field] !== newVersion[field]) {
			const type: ChangeType = !oldVersion[field]
				? 'added'
				: !newVersion[field]
					? 'removed'
					: 'modified';

			changes.push({
				fieldName: field,
				oldValue: oldVersion[field],
				newValue: newVersion[field],
				type
			});
		}
	}

	return changes;
}

export function formatVersionDate(date: string): string {
	return new Date(date).toLocaleString('cs-CZ', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}