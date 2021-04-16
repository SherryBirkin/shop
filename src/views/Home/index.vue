<template>
    <div class="home">
        <nav-bar>
            <template v-slot:default>图书</template>
        </nav-bar>
        <tab-control 
            :titles="['畅销','新书','精选']"
            @tabClickHandle="tabClickHandle" 
            v-show="isTabFixed"
            class="fixedTabCtrl"
            :activeInd="tabActiveInd"
        ></tab-control>
        <div class="commonContent homeContent" ref="homeContent">
            <div class="commonContentInner">
                <div ref="innerRef">
                    <!-- <div class="banners">
                        <img src="~_imgPath/book1.jpg" alt="bannerpic" class="bannerPic"/>
                    </div> -->
                    <home-swiper class="banners" :banners="banners"></home-swiper>
                    <recommend-view :rec="rec"></recommend-view>
                </div>
                <tab-control 
                    :titles="['畅销','新书','精选']"
                    @tabClickHandle="tabClickHandle" 
                    :activeInd="tabActiveInd"   
                ></tab-control>
                <goods-list :displayGoods="displayGoods"></goods-list>
            </div>
        </div>
        <back-top v-show="showBackTop" @bTopHandle="bTopClickHandle"></back-top>
    </div>
</template>

<script>
import {onMounted,reactive,toRefs,ref,computed,nextTick,watchEffect} from "vue";
import {getHomeAllData,getHomeGoods} from "@/network/home";
import NavBar from "_comps/common/NavBar";
import RecommendView from "./ChildComps/RecommendView";
import TabControl from "_comps/content/TabControl";
import GoodsList from "_comps/content/goods/GoodsList";
import BetterScroll from "better-scroll";
import BackTop from "_comps/common/BackTop";
import HomeSwiper from "./ChildComps/HomeSwiper";

export default {
	name:"Home",
    components:{NavBar,RecommendView,TabControl,GoodsList,BackTop,HomeSwiper},
	setup(){
        const tabData=reactive({//推荐列表数据
            rec:[]
        });
        const goods=reactive({  //tab三种类型数据
            sales:{page:1,list:[]},
            recommend:{page:1,list:[]},
            new:{page:1,list:[]},
        });
        let bScroll=reactive({});       //将用来表示better-scroll插件对象
        const normalData=reactive({
            displayType:"sales",    //当前类型
            isTabFixed:false,       //控制是否显示固定tab
            tabActiveInd:0,         //由于有两个相同的tab，故要弄个状态表示正在显示的
            showBackTop:false,      //是否显示返回顶部按钮
            banners:[]              //用于swiper的图片数据列表
        });
        const innerRef=ref(null);   //tab上面的内容部分。
        /**innerRef在template中指定了html元素，则innerRef.value就是该元素 */

        const bTopClickHandle=()=>{
            bScroll.scrollTo(0,0,500);
        };
        const tabClickHandle=tabInd=>{  //点击tab切换回调
            const typesArr=["sales","new","recommend"];
            normalData.displayType=typesArr[tabInd];
            normalData.tabActiveInd=tabInd;
            //切换类型后也重新计算内容高度
            nextTick(()=>{
                bScroll&&bScroll.refresh();
            });
        };
        
        const displayGoods=computed(()=>{   //计算出当前类型的数据
            return goods[normalData.displayType].list;
        });

		onMounted(async () => {
			try{//获取推荐列表数据
                const data=await getHomeAllData();
                tabData.rec=data?.goods.data;
                normalData.banners=data?.slides;
            }catch(err){}

            try {//获取tab三种类型的数据
                const goodsSalesData=await getHomeGoods("sales"),
                    goodsRecommend=await getHomeGoods("recommend"),
                    goodsNew=await getHomeGoods("new");
                goods.sales.list=goodsSalesData.goods.data;
                goods.recommend.list=goodsRecommend.goods.data;
                goods.new.list=goodsNew.goods.data;
            } catch (error) {
                
            }

            nextTick(()=>{  //这里面都是结合better-scroll插件滚动的使用
                bScroll=new BetterScroll(
                    document.querySelector(".commonContent"),
                    {
                        probeType:3, //3只要在运动时就触发scroll事件
                        click:true, //是否允许点击
                        pullUpLoad:true //是否上拉加载更多，默认false
                    }
                );
                bScroll.on("scroll",pos=>{  //滚动回调
                    // console.log(pos.y);
                    /**如果 滚动部分 比 tab上面的内容部分 大，则说明tab滚到了上沿
                     * 或以上，需要把固定tab显示出来。
                     */
                    const innerH=innerRef.value.offsetHeight;
                    normalData.isTabFixed=(-pos.y) > innerH;
                    normalData.showBackTop=(-pos.y) > 60;
                });
                bScroll.on("pullingUp",async pos=>{ //上拉回调
                    console.log('上拉加载更多');
                    const comConInner=document.querySelector(".commonContentInner");
                    console.log(`当前高度：${comConInner.clientHeight}`);
                    const curType=normalData.displayType;
                    const page=goods[curType].page+1;
                    try {
                        const goodsReqData=await getHomeGoods(curType,page);
                        goods[curType].list.push(...goodsReqData.goods.data);
                        goods[curType].page+=1;
                    } catch (error) {
                        
                    }
                    
                    //完成上拉，等数据请求完成，要把新数据展示出来
                    bScroll.finishPullUp();
                    //重新计算内容高度
                    bScroll.refresh();
                    console.log(`上拉刷新后的高度：${comConInner.clientHeight}`);
                    console.log(`当前页：${page}，当前类型：${curType}`);
                });
                //监听 任何一个变量有变化都重新计算高度
                watchEffect(()=>{
                    nextTick(()=>{
                        bScroll&&bScroll.refresh();
                    });
                });
            });
            
		})

        return {
            tabClickHandle,
            bTopClickHandle,
            ...toRefs(tabData),
            ...toRefs(goods),
            ...toRefs(normalData),
            displayGoods,
            innerRef,
        }
	}
};
</script>
<style lang="scss" scope>
// .banners{
//     height:200px;

//     .bannerPic{
//         width:100%;
//     }
// }
.home{
    .homeContent{
        overflow:hidden;
    }
    .fixedTabCtrl{
        position:fixed;
        top:45px;
        left:0;
    }
}
</style>