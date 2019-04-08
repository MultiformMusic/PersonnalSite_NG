import { RssActions, 
         SET_LOADING, 
         LOAD_RSS_URL,
         SHOW_FILTERS} from './rss.actions';
import { RssUrl } from '../models/rss-url';

// interface state du reducer
export interface RssState {

    rssUrls: RssUrl[];
    isLoading: boolean;
    showFilters: boolean;
}

// state initial
const INITIAL_STATE: RssState = {

    rssUrls: [],
    isLoading: true,
    showFilters: true,
}

// reducer rss => modifie le state suivant action reçue
export function rssReducer(state = INITIAL_STATE, action: RssActions) {

    switch(action.type) {

        case SET_LOADING:

            return {
                ...state,
                isLoading: action.payload
            };

        case LOAD_RSS_URL:

            return {
                ...state,
                rssUrls: action.payload
            }


        case SHOW_FILTERS:

            return {
                    ...state,
                    showFilters: action.payload
            }

        default:

            return state;
    }
}

// function d'aide pour accèder à l'état du state
export const getIsLoading = (state: RssState) => state.isLoading;
export const getRssUrls = (state: RssState) => state.rssUrls;
export const getShowFilters = (state: RssState) => state.showFilters;