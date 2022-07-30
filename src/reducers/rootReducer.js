const initState = {
    count: 0,
    posts: []
}
const rootReducer = (state = initState, action) => {
    if (action.type === 'INCREMENT') {
        state.count += action.payload
        return { ...state }
    }
    return state
}

export default rootReducer