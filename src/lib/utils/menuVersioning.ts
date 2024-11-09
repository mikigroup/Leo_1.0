import type { MenuVersion, VersionChange } from '$lib/types/menu';

export function compareVersions(oldVersion: MenuVersion, newVersion: MenuVersion): VersionChange[] {
	const changes: VersionChange[] = [];

	const compareFields = ['soup', 'active', 'notes', 'type', 'nutri'];

	for (const field of compareFields) {
		if (oldVersion[field] !== newVersion[field]) {
			changes.push({
				fieldName: field,
				oldValue: oldVersion[field],
				newValue: newVersion[field],
				type: !oldVersion[field] ? 'added' :
					!newVersion[field] ? 'removed' : 'modified'
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