/*
export function someMutation (state) {
}
*/

export const setToken = (state, token) => {
  if (process.env.DEV) {
    console.log(token)
  }
  state.token = token

}
