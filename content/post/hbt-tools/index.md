---
title: HBT Tools
description: Tools for HBT Analysis in IOED.
slug: hbt-tools
date: 2026-04-13T00:00:00.000Z
categories:
    - projects
---

> This project was made in IOED Lab, NTU

## Background

Characterizing HBTs involves two main domains: **DC analysis**, which examines current gain, ideality factors, and leakage through Gummel plots and output curves, and **RF/AC analysis**, which extracts small-signal model parameters from S-parameter measurements. Doing this manually across multiple bias points is tedious and error-prone, so I built a set of Python tools to automate the workflow.

## IOED HBT Tools

**IOED HBT Tools** is a [Streamlit](https://streamlit.io)-based web application for HBT DC analysis, RF characterization, small-signal model (SSM) extraction, and parameter tuning. It runs entirely in Python, either on the [streamlit server](https://hbt-tools.streamlit.app/) or locally.

The source code is available on GitHub: [ioedhbt/hbt-tools (IOED-Tools branch)](https://github.com/ioedhbt/hbt-tools/tree/IOED-Tools).

## DC Analysis

The Gummel analyzer module accepts measured Gummel plot data and overlays multiple bias points for comparison. Ideality factors for the base and collector currents are extracted automatically from the log-linear slope of each curve.

![Picture: Gummel plot with extracted ideality factors](dc_gummel.png "Gummel plot with extracted ideality factors")

## RF Extraction and Small-Signal Model Fitting

The RF extraction module takes multi-bias `.s2p` S-parameter files, performs open/short de-embedding, and computes gain and stability metrics including |h₂₁|², Mason's unilateral gain U, and the Rollett stability factor K. From these, it extracts the small-signal equivalent circuit following the procedure of Cheng et al. (*Microelectronics Journal*, 121, 2022).

The extracted model is then fitted back to the measured S-parameters. The Bode/Smith chart below shows the S21 magnitude and phase after fitting, confirming good agreement between the model and measurement across frequency.

![Picture: S21/Bode plot after SSM fitting](smith_bode.png "S21/Bode plot after SSM fitting")

## GPU-Accelerated Parameter Tuning

To handle the large combinatorial search space during model parameter optimization, the tuning engine supports **CUDA acceleration via CuPy**. The implementation features adaptive batch sizing that automatically fits the per-iteration sweep to available VRAM, expands when headroom allows, and shrinks on out-of-memory events—avoiding repeated pool flushes on Windows WDDM drivers. This enables massive-parallel combo sweeps that would be impractical on CPU alone.
