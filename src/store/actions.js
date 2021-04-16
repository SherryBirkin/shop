import { getCart } from "@/network/cart";

const actions={
    /**
     * 通过请求获取购物车的数据，得到购物车的商品数量，
     * 更新表示购物车的商品数量的全局状态
     */
    updateCartCountAction:async (context)=>{
        try {
            const getCartData=await getCart();
            context.commit("addCart",{count:getCartData?.data.length||0});
        } catch (error) {
            
        }
    }
};

export default actions;