const mutations={
    setIsLogin(state,payload){
        state.user.isLogin=payload;
    },
    /**
     * 更新购物车商品的数量
     * @param {*} state 
     * @param {Object} payload {count:购物车商品的新数量}
     */
    addCart(state,payload){
        state.cartCount=payload.count;
    },
};

export default mutations;