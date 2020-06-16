const storage = window.localStorage;

export const appStorage = {

    setUser: user => storage.setItem('user',user),
    getUser: () => storage.getItem('user'),
    removeUser: () => storage.removeItem('user'),

    setUserId: id => storage.setItem('userId',id),
    getUserId: () => storage.getItem('userId'),
    removeUserId: () => storage.removeItem('userId'),

    setToken: token => storage.setItem('token',token),
    getToken: () => storage.getItem('token'),
    removeToken: () => storage.removeItem('token'),

    setPollId: (user, id) => storage.setItem(user + id + "",id),
    getPollId: (user, id) => storage.getItem(user + id + ""),

    setOrderId: (user, id) => storage.setItem("order" + user + id + "",id),
    getOrderId: (user, id) => storage.getItem("order" + user + id + ""),

}