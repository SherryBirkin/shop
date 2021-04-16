module.exports={
    configureWebpack:{
        resolve:{
            alias:{
                "_imgPath":"@/assets/images",
                "_cssPath":"@/assets/css",
                "_comps":"@/components",
            }
        }
    },
    css:{
        loaderOptions:{
            sass:{
                prependData:`
                    @import "@/assets/css/variable";
                    @import "@/assets/css/mixin";
                `
            }
        }
    },
    devServer:{
        compress:false
    }
};