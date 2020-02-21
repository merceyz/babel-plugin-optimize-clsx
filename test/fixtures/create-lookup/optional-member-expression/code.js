// https://github.com/DestinyItemManager/DIM/blob/b51598fcb6f6caa2b7e3e82a13ca751298f1c708/src/app/inventory/InventoryItem.tsx#L77-L82
clsx({
  [styles.subclassPathTop]: 'top' === subclassPath?.position,
  [styles.subclassPathMiddle]: subclassPath?.position === 'middle',
  [styles.subclassPathBottom]: subclassPath?.position === 'bottom',
});
