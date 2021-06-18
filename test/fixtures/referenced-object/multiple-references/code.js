// https://github.com/DestinyItemManager/DIM/blob/a441eff6be8cbdd48477baa9ac30d9147153a08e/src/app/inventory/InventoryItem.tsx#L84-L89

const itemStyles = {
	[styles.searchHidden]: searchHidden,
	[styles.subclassPathTop]: subclassPath && subclassPath.position === 'top',
	[styles.subclassPathMiddle]: subclassPath && subclassPath.position === 'middle',
	[styles.subclassPathBottom]: subclassPath && subclassPath.position === 'bottom',
};

// https://github.com/DestinyItemManager/DIM/blob/a441eff6be8cbdd48477baa9ac30d9147153a08e/src/app/inventory/InventoryItem.tsx#L102
clsx('foo', itemStyles);

clsx('bar', itemStyles);
