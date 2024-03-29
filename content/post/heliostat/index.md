---
title: "Automatic Heliostat Directing System Based On Microcontroller ESP32"
description: "A heliostat prototype that keeps the reflection of sunlight on a fixed target with a mirror."
slug: "heliostat"
date: 2023-08-01 00:00:00+0000
categories:
    - projects
---

>This project was the thesis project for my undergraduate study. The research was presented in [ICEEI 2023](https://stei.itb.ac.id/iceei2023/) and a paper was published with DOI:[10.1109/ICEEI59426.2023.10346650](https://doi.org/10.1109/ICEEI59426.2023.10346650).

## Background

Solar power is a source of renewable energy that is usually converted into electricity using photovoltaics (solar panels). The low efficiency of solar panel calls for the development of other alternatives, such as heliostats.

Heliostat is a device that reflects sunlight to a boiler in concentrated solar power (CSP) systems to generate electricity. However, the high investment cost is the highest barrier for its development.

This research focuses on the development of a heliostat that keeps the reflection of the sunlight on a target throughout the day.

## Method

A heliostat works by moving a mirror in 2 axes: the azimuth axis and the elevation axis. These axes are also used to denote the position of the sun in a certain location at a certain time. 

![Illustration on the azimuth and elevation axes. Source: https://www.celestis.com/resources/faq/what-are-the-azimuth-and-elevation-of-a-satellite/](az_elevation.jpg)

The position of the sun at can be algorithmically determined with the [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/). After acquiring the sun position (in azimuth and elevation), the mirror can then be positioned to keep the reflection of the sun on the target.

![Heliostat mirror reflects sunlight to the target](reflection1.png) ![The mirror moves at half the angular motion of the sun](reflection2.png)

The mirror should be positioned between the sun and the target. The system can then be represented in the following block diagram: ![](block-diagram.png)

The heliostat require an accelerometer and gyroscope sensor as well as a magnetometer sensor to detect the orientation of the mirror, which can be moved using servo motors.

This animation I created in Desmos shows the desired behavior of the final product. The red line is the mirror, the yellow line is the sunlight, and the green line is the reflected sunlight.

{{< youtube W6gKNx95SNQ >}}

## Prototype

A PCB was designed for the electrical components needed by the device.

![The PCB designed in KiCad](pcb-design.png) ![Printed version](pcb-result.png)

Then, the components were assembled and put together inside a case, as seen below.

![The assembled components on the PCB](assembled-pcb.jpeg) ![The heliostat](heliostat.png)

## Results

We did a test to determine its performance in keeping the sunlight reflection on the target, as well as its heating effects on the target. Here's a demonstration video of the heliostat. Please feel free to turn on the caption.

{{< youtube LS8yblDopR0 >}}

The change in temperature due to the reflected sunlight is presented in the following graph.

![](test-graph.png)

## Conclusion

Heliostat can be controlled by determining the positions of the sun and target, then calculating the required mirror position. The created prototype successfully increased the temperature in the target.
