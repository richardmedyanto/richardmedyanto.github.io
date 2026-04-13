---
title: "智慧汽车系统"
description: "一个整合多项智能功能以解决各种汽车相关问题的系统。"
slug: "smart-car"
date: 2022-07-08 00:00:00+0000
categories:
    - projects
---

> 本项目为我本科第六学期课程 *Microcontroller Design and Application、Automotive Engineering、Computer System Development and Methodology* 的期末项目。

## 背景

2020 年，印度尼西亚因交通事故死亡人数达到 30,668 人，成为继健康相关死亡之后的第二大死亡原因。

暴露在阳光下的汽车车厢可能会变得非常炎热，从而引发化学反应，产生有害气体。此外，处于高温环境中的人也可能会遭受中暑。

根据道路安全行动网络（Safe Distance）的数据，2016 年有 33.63% 的事故发生在 18:00 至 24:00 之间，这表明低光照条件可能是重要原因之一。

## 解决方案

设计一个集成多种智能功能的智能汽车系统，以解决上述问题。

## 功能

* 定速巡航
* 碰撞预防
* 自动车厢降温系统
* 自动车灯系统
* 摄像头监控系统

## 系统框图

以下为原型系统的框图：

![框图](block-diagram.png)

作为一个集成系统，该原型使用多个微控制器，并通过 I2C 进行通信。同时，系统使用多种传感器来检测环境输入。例如，ESP32 接收来自 TEMT6000 的光强信号，而 Arduino Uno 则接收来自 4 个 HC-SR04 超声波传感器的距离数据。

## 原型

![原型](prototype.png)

## 演示

{{< youtube sk2ViFiFlVM >}}
