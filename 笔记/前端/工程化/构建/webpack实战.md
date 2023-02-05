# 概述
重新设计[[vue-element-admin]]的构建流程
背景：本身是个复杂，开源的SPA应用。虽然这个项目是使用vue/cli构建的。现在使用webpack原生配置重新手写，使用webpack重新进行打包构建。

webpack是面向JS的，默认情况打包结果是JS

css-loader把css代码转化为JS模块。 