const moviesPage = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PAGE':
        return {
            ...state,
            page: action.page
        }
    default:
      return state
  }
}

export default moviesPage