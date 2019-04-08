import * as fromRss from './app/rss/ngrx/rss.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

// aggrégation des states
export interface State {

    rss: fromRss.RssState;
}

// aggrégation des reducers
export const reducers: ActionReducerMap<State> = {
    
    rss: fromRss.rssReducer
}

// sélecteur => méthode retournant partie du state
export const getRssState = createFeatureSelector<fromRss.RssState>('rss');
export const getIsLoading = createSelector(getRssState, fromRss.getIsLoading);
export const getRssUrls = createSelector(getRssState, fromRss.getRssUrls);
export const showFilters = createSelector(getRssState, fromRss.getShowFilters);
