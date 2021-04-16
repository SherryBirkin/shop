import {request} from "./request";

//添加商品到购物车，data:{goods_id:商品id, num:添加的数量}
export function addCart(data){
    return request({
        url:`/api/carts`,
        method:"post",
        data
    });
}

//修改购物车，data:{num:数量}
export function modifyCart(id,data){
    return request({
        url:`/api/carts/${id}`,
        method:"put",
        data
    });
}

//选择商品的状态checked，data:所有选中的id组成的数组
export function checkedCart(data){
    return request({
        url:`/api/carts/checked`,
        method:"patch",
        data
    });
}

//获取购物车列表
export function getCart(data=""){
    return request({
        url:`/api/carts?${data}`
    });
}

//删除购物车中的某个商品
export function deleteCartItem(id){
    return request({
        url:`/api/carts/${id}`,
        method:"delete"
    });
}