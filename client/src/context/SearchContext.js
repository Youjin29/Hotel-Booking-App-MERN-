import { createContext, useReducer } from "react";

const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

const INITIAL_STATE = {
    city: undefined,
    dates: [ {
        startDate: startDate,
        endDate: new Date(startDate.getTime() + (24*60*60*1000)),
        key: "selection",
      }],
    options: {
        adult: undefined,
        children: undefined,
        room: undefined,
    },
};

export const SearchContext = createContext(null);
export const SearchDispatchContext = createContext(null);

const SearchReducer = (state, action) => {
    switch(action.type) {
        case "NEW_SEARCH": {
            return action.payload
        }
        case "RESET_SEARCH": {
            return INITIAL_STATE
        }
        default: {
            return state;
        }
    }
};

export const SearchProvider = ({children}) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE)
 
    return (
        <SearchContext.Provider value={state}>
            <SearchDispatchContext.Provider value={dispatch}>
            {children}
            </SearchDispatchContext.Provider>
        </SearchContext.Provider>
        );
}