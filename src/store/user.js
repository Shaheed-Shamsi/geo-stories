import axios from 'axios'
const MASTER_IP_ADDRESS = '172.17.20.35'
// import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'


/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get(`http://${MASTER_IP_ADDRESS}:8080/auth/me`)
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`http://${MASTER_IP_ADDRESS}:8080/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
  // try {
    //   dispatch(getUser(res.data))
    //   history.push('/home')
    // } catch (dispatchOrHistoryErr) {
      //   console.error(dispatchOrHistoryErr)
      // }
}

export const logout = () => async dispatch => {
  try {
    await axios.post(`http://${MASTER_IP_ADDRESS}:8080/auth/logout`)
    dispatch(removeUser())
    // history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

  /**
   * INITIAL STATE
   */
const defaultUser = {}

    /**
     *
     * REDUCER
     */

export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
