export interface BaseTag {
	id: number;
	name: string;
	describe: string | null;
	number: number | null;
	created_at: string | null;
	updated_at: string | null;
}

export type Tag = BaseTag;

export type TagType = 'allergen' | 'ingredient';

export interface TagUpdateEvent {
	tags: Tag[];
	type: TagType;
}

export interface TagSelectorProps {
	selectedTags: Tag[];
	availableTags: Tag[];
	type: TagType;
}