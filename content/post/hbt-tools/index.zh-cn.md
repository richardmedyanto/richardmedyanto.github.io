---
title: HBT Tools
description: Tools for HBT Analysis in IOED.
slug: hbt-tools
date: 2026-04-13T00:00:00.000Z
categories:
    - projects
---

> 本项目在台湾大学 IOED 实验室完成

## 背景

HBT 的表征主要包括两个方面：**直流（DC）分析**，通过 Gummel 曲线和输出特性曲线分析电流增益、理想因子和漏电流；以及 **射频/交流（RF/AC）分析**，通过 S 参数测量提取小信号模型参数。在多个偏置点下手动完成这些分析既繁琐又容易出错，因此我开发了一套 Python 工具来自动化这一流程。

## IOED HBT Tools

**IOED HBT Tools** 是一个基于 [Streamlit](https://streamlit.io) 的 Web 应用，用于 HBT 的 DC 分析、RF 表征、小信号模型（SSM）提取以及参数调优。该工具完全使用 Python 编写，可在 [Streamlit 在线服务器](https://hbt-tools.streamlit.app/) 或本地运行。

源代码已开源于 GitHub：
[ioedhbt/hbt-tools (IOED-Tools 分支)](https://github.com/ioedhbt/hbt-tools/tree/IOED-Tools)

## 直流分析

Gummel 分析模块可导入测量得到的 Gummel 曲线数据，并叠加多个偏置点以进行对比。基极电流和集电极电流的理想因子通过对每条曲线的对数-线性斜率自动提取。

![图：带理想因子提取的 Gummel 曲线](dc_gummel.png "Gummel plot with extracted ideality factors")

## 射频提取与小信号模型拟合

RF 提取模块读取多偏置点的 `.s2p` S 参数文件，执行开路/短路去嵌（de-embedding），并计算增益与稳定性指标，包括 |h₂₁|²、Mason 单向增益 U，以及 Rollett 稳定因子 K。在此基础上，按照 Cheng 等人（*Microelectronics Journal*, 121, 2022）的方法提取小信号等效电路模型。

随后，将提取的模型与测量得到的 S 参数进行拟合。下方的 Bode 图/Smith 图展示了拟合后的 S21 幅度与相位，表明模型与测量结果在频率范围内具有良好一致性。

![图：SSM 拟合后的 S21/Bode 图](smith_bode.png "S21/Bode plot after SSM fitting")

## GPU 加速参数调优

为应对模型参数优化过程中庞大的组合搜索空间，该调优引擎支持通过 **CuPy 实现 CUDA 加速**。其实现包含自适应批处理大小机制：根据可用显存自动调整每次迭代的计算规模，在资源允许时扩大批次，在显存不足时缩小规模，从而避免在 Windows WDDM 驱动下频繁清空内存池。这使得大规模并行参数扫描成为可能，而在仅使用 CPU 的情况下几乎不可实现。


