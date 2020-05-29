const redux = require('redux');
const thunk = require('redux-thunk').default;
const axios = require('axios');

const ROOT_URL = 'http://localhost:3000';

const UPDATE_POSTS = 'UPDATE_POSTS';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const UPDATE_DONE = 'UPDATE_DONE';

const updatePosts = (posts) => ({type: UPDATE_POSTS, payload: posts});
const updateProfile = (profile) => ({type: UPDATE_PROFILE, payload: profile});
const updateDone = () => ({type: UPDATE_DONE});

const loadPosts = () => async (dispatch) => {
  const response = await axios.get(ROOT_URL + '/posts');

  return dispatch(updatePosts(response.data));
};

const loadProfile = () => async (dispatch) => {
  const response = await axios.get(ROOT_URL + '/profile');

  return dispatch(updateProfile(response.data));
};

const dispatchChaining = () => async (dispatch) => {
  await Promise.all([
    dispatch(loadPosts()),
    dispatch(loadProfile())
  ]);

  return dispatch(updateDone());
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_POSTS:
      return {...state, posts: action.payload};

    case UPDATE_PROFILE:
      return {...state, profile: action.payload};

    case UPDATE_DONE:
      return {...state, isDone: true};

    default:
      return state;
  }
};

const store = redux.createStore(reducer, {}, redux.applyMiddleware(thunk));
const unsubscribe = store.subscribe(async () => console.log(store.getState()));

// Done is always set to true BEFORE async calls complete
// const actions = redux.bindActionCreators({loadPosts, loadProfile, updateDone}, store.dispatch);
// actions.loadPosts();
// actions.loadProfile();
// actions.updateDone();

const actions = redux.bindActionCreators({dispatchChaining}, store.dispatch);
actions.dispatchChaining().then(() => unsubscribe());
