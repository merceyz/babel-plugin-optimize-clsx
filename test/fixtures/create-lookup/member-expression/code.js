// https://github.com/DestinyItemManager/DIM/blob/a441eff6be8cbdd48477baa9ac30d9147153a08e/src/app/inventory/InventoryItem.tsx#L84-L89
clsx({
  [styles.subclassPathTop]: 'top' === subclassPath.position,
  [styles.subclassPathMiddle]: subclassPath.position === 'middle',
  [styles.subclassPathBottom]: subclassPath.position === 'bottom',
});
