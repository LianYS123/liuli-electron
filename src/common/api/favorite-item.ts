import { FavoriteItemService } from '@src/main/services/favorite-item.service';
import { ChannelsType, getAPI } from './getAPI';

const channels: ChannelsType<FavoriteItemService> = {
    createItem: 'createItem',
    updateItem: 'updateItem',
    findAllItems: 'findAllItems',
    findItemById: 'findItemById',
    deleteItem: 'deleteItem',
    addItem: 'addItem',
    moveItem: 'moveItem',
    retrieveItemsFromCategory: 'retrieveItemsFromCategory',
    getAllCategoriesWithItems: 'getAllCategoriesWithItems'
};

export const favoriteItemAPI = getAPI(channels, { prefix: 'FavoriteItemService' });
