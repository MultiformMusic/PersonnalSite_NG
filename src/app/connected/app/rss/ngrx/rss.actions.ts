import { Action } from '@ngrx/store';
import { RssUrl } from '../models/rss-url';


export const SET_LOADING = '[RSS] SET_LOADING';
export const LOAD_RSS_URL = '[RSS] LOAD_RSS_URL';
export const SHOW_FILTERS = '[RSS] SHOW_FILTERS';
export const SET_FROM_CACHE = '[RSS] SET_FROM_CACHE';

/** class :  Action Type/ Action Creator */

export class setLoading implements Action {

    readonly type = SET_LOADING;

    constructor(public payload: boolean) {}

}

export class loadRssUrls implements Action {

    readonly type = LOAD_RSS_URL;

    constructor(public payload: RssUrl[]) {}
}

export class showFilters implements Action {

    readonly type = SHOW_FILTERS;

    constructor(public payload: boolean) {}
}

export class setFromCache implements Action {

    readonly type = SET_FROM_CACHE;

    constructor(public payload: boolean) {}
}

export type RssActions = setLoading |
                         loadRssUrls |
                         showFilters |
                         setFromCache
                         ;