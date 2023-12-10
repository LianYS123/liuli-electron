import { FavoriteItem } from '@src/common/interfaces/favorite-item.interface';
import { FavoriteItemEntity } from '../entity/favorite-item.entity';
import { ItemType } from '@src/common/constants';
import { dataSource } from '../databases';

export class FavoriteItemService {
  async createItem(data: FavoriteItem): Promise<FavoriteItemEntity> {
    const item = FavoriteItemEntity.create(data); // TypeORM 的静态方法

    if (data.parentId) {
      const parent = await FavoriteItemEntity.findOneBy({ id: data.parentId });
      if (!parent) {
        throw new Error('Parent item not found.');
      }
      item.parent = parent;
    }

    await FavoriteItemEntity.save(item);
    return item;
  }

  async updateItem(
    id: number,
    data: Partial<FavoriteItem>,
  ): Promise<FavoriteItemEntity> {
    const item = await FavoriteItemEntity.preload({ id, ...data });

    if (!item) {
      throw new Error('Item not found.');
    }

    await FavoriteItemEntity.save(item);
    return item;
  }

  async findAllItems(): Promise<FavoriteItemEntity[]> {
    return FavoriteItemEntity.find();
  }

  async findItemById(id: number): Promise<FavoriteItemEntity> {
    const item = await FavoriteItemEntity.findOneBy({ id });
    if (!item) {
      throw new Error('Item not found.');
    }
    return item;
  }

  async deleteItem(id: number): Promise<void> {
    const deleteResult = await FavoriteItemEntity.delete(id);
    if (!deleteResult.affected) {
      throw new Error('Item not found or could not be deleted.');
    }
  }

  async addItem(data: FavoriteItem): Promise<FavoriteItemEntity> {
    const item = FavoriteItemEntity.create({
      ...data,
      type: ItemType.FAVORITE, // 确保类型始终为FAVORITE类型
    });

    // 如果有parentId代表该条目属于某个分类
    if (data.parentId) {
      const parent = await FavoriteItemEntity.findOneBy({ id: data.parentId });
      if (!parent) {
        throw new Error('Parent category not found.');
      }
      item.parent = parent;
    }

    await FavoriteItemEntity.save(item);
    return item;
  }

  async moveItem(id: number, parentId: number): Promise<FavoriteItemEntity> {
    const item = await FavoriteItemEntity.findOneBy({ id });
    if (!item) {
      throw new Error('Item not found.');
    }

    const newParent = await FavoriteItemEntity.findOneBy({ id: parentId });
    if (!newParent || newParent.type !== ItemType.CATEGORY) {
      throw new Error(
        'New parent category not found or is not a category type.',
      );
    }

    item.parent = newParent;
    await FavoriteItemEntity.save(item);
    return item;
  }

  async retrieveItemsFromCategory(
    categoryId: number,
  ): Promise<FavoriteItemEntity[]> {
    const items = await FavoriteItemEntity.find({
      where: {
        parent: { id: categoryId },
        type: ItemType.FAVORITE, // 确保我们只得到FAVORITE类型的项目
      },
      relations: ['parent'],
    });

    if (!items) {
      throw new Error(
        'No items found for this category or category does not exist.',
      );
    }

    return items;
  }
  // 在FavoriteItemService中
  async getAllCategoriesWithItems(): Promise<FavoriteItemEntity[]> {
    // FavoriteItemEntity
    // You use getManager to get access to the tree repository methods.
    const manager = dataSource.manager
    // Assuming FavoriteItemEntity has a tree structure (e.g., @Tree("closure-table"))
    const roots = await manager.getTreeRepository(FavoriteItemEntity).findRoots();
    const trees = await Promise.all(
      roots.map(root => manager.getTreeRepository(FavoriteItemEntity).findDescendantsTree(root))
    );
    
    return trees;
  }
}

export const favoriteItemService = new FavoriteItemService()