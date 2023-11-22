import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const INITIAL_STATE = {
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    loading: false,
    error: null, 
}

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {...state, loading: true}

        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: null,
            }

        case "LOGIN_FAILURE":
            return {
                user: null,
                loading: false,
                error: action.payload,
            }

        case "LOG_OUT":
            return {
                user: null,
                loading: false,
                error: null,
            }

        default: {
            return state;
        } 
    }
}

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user]);

    return (
        <AuthContext.Provider value = {{...state, dispatch}} >
            {children}
        </AuthContext.Provider>
    )
}