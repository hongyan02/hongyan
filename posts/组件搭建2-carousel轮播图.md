---
date: '2025-06-23T10:39:39+08:00'
draft: true
title: '组件搭建2 Carousel轮播图'
---

**Carousel(轮播图)在同一个区域内轮流展示多张图片或内容块，提升视觉吸引力并节省页面空间**

轮播图的构成主要为以下3项：

- 图片区域
- 左右控制按钮
- 圆点指示器

这些都可以通过html+CSS定位美化形成一个基本的轮廓形状。

实现的难点还是在JS上，自动轮播和最后一张图片切换到第一张图片的平滑滚动效果。

如果我们不对最后一张图片切换到第一张图片的平滑滚动进行处理，那么默认的CSS效果是从最后一张往前翻阅到第一张。也就是中间出现的图片都会再出现一遍。

那么要克服这个问题需要，将原先数组的内容的第一个和最后一个分别复制一份放到尾和首的位置。

<img src=""
