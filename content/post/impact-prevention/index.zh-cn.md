---
title: "模拟车门碰撞预防系统"
description: "一个检测到附近障碍物时发出警报的模拟系统。"
slug: impact-prevention
date: 2021-07-11 00:00:00+0000
categories:
    - projects
---

> 本项目为我本科第四学期《控制系统》课程期末项目。

## 背景

在停车场中，碰撞到墙壁、行人或其他车辆有时很难仅凭视觉避免。超声波传感器通常安装在汽车前后用于检测距离，但车身侧面很少配备此类传感器。本小组项目的目标是在车辆侧面增加红外传感器（由于课程要求，本设计采用模拟电路实现）。

## 电路设计

![图：电路设计](schematic_consys.jpg "Circuit Design")

## 工作原理

**简要说明（TL;DR）**：红外传感器检测到的距离会与两个固定阈值进行比较。距离越近，蜂鸣器报警频率越高。

红外传感器在检测到 10–80 cm 范围内的障碍物时会输出模拟电压。障碍物越近，输出电压越高。该模拟电压随后通过两个 LM741 比较器与电位器设定的阈值进行比较。上方比较器在距离较近时输出高电平，下方比较器在距离更近时也会输出高电平。

电位器的设定位置基于如下近似计算：

![图：电位器旋转比例。来源：https://www.pololu.com/product/136](pot_turn.jpg "The percentage of potentiometer turn")

当仅上方比较器导通时，LM555 会输出约 1.8 Hz 的方波驱动蜂鸣器。这是因为在该状态下，LM555 使用连接到继电器常开端的 33 μF 电容。

当障碍物更近时，下方比较器也会导通，从而触发继电器，使 LM555 切换到连接常闭端的 10 μF 电容，蜂鸣器输出更高频率信号，约 5.8 Hz。

## 原型

![图：原型](prototype.png "The prototype")

## 展示

（印尼语）

{{< youtube w0EJugUqVQU >}}

[演示文稿链接](https://www.canva.com/design/DAEXnbXfPTM/UMC_lzbS3-lSLgSNfd8P9g/view?utm_content=DAEXnbXfPTM&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton)

