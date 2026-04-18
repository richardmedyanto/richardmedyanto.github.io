---
title: "VHDL 實現 FIR 與 IIR 濾波器"
description: "以乘積累加方式實現 FIR 與 IIR 數位系統設計，作為數位系統課程助教成果。"
slug: "fir-iir-vhdl"
date: 2022-03-14 00:00:00+0000
categories:
    - projects
---

> 本專案是在我擔任數位系統課程助教期間完成的。

## 背景

在大學第五學期期間，我作為課程助教為 70 名低年級學生教授數位系統課程。在授課教師 Ir. Sofyan, S.Kom., M.Eng. 的指導下，我負責教學與協助學生完成課程專題，主要講解 FIR（有限脈衝響應）與 IIR（無限脈衝響應）濾波器的實作，以支援其期末專題開發。

## 數位濾波器與最佳化

數位濾波器接收離散輸入並輸出濾波後的離散訊號，可用於去除高頻、低頻或特定頻段的訊號，廣泛應用於感測器處理與各種演算法中。常見的數位濾波器包括 FIR 與 IIR。

FIR 濾波器實作較為簡單，通常透過移位暫存器、乘法與加法實現輸出，但缺點是為了獲得良好的頻率響應，需要較高階數。

![FIR filter. Image taken from O'Reilly website](fir.png)

相較之下，IIR 濾波器在較低階數下即可獲得良好的頻率響應，相比 FIR 具有較低的運算與記憶體需求。

![IIR filter. Image taken from National Instruments website](iir.png)

在上述圖中（串接二階節點形式），系統需要進行多次乘法與加法運算。一般情況下，可以為每個運算單元設計獨立硬體，例如一個 section 需要 5 個乘法器與 5 個加法器。但這種平行實作會大量消耗硬體資源，因為乘法與加法屬於組合邏輯電路，在 FPGA/CPLD 上資源有限。

![IIR filter 的潛在問題](iir-problem.png)

因此可以利用時脈頻率遠高於資料更新速率的特性，將原本的平行運算改為序列執行。透過一個乘加單元（multiply-accumulate, MAC）依序完成所有計算，而不是使用多個平行運算單元。這就像使用一台計算機依序完成 10 次計算，而不是使用 10 台計算機同時計算。由於輸入來自不同路徑，需要使用多工器（MUX）來選擇輸入來源。

![Multiply-accumulate approach](multiply-accumulate.png)

最終實作的 VHDL 程式基於串接二階結構，實現 FIR 與 IIR 濾波器的數位設計最佳化版本，以降低硬體資源使用量。濾波器增益係數透過 MATLAB Filter Design 計算並轉換為二進位以符合設計規格。完整 VHDL 程式碼可於 [Github](https://github.com/richardmedyanto/DigitalSystem) 查看。

## 結論

最終實作了 7 階 FIR 濾波器與 6 階 IIR 濾波器的 VHDL 設計，輸入與輸出皆為 8 位元。最佳化後的 IIR 濾波器採用序列式乘加架構，而非純組合邏輯實作。

## 課程講義

我為課程每一堂課製作了投影片講義。可於此查看：[講義連結](https://drive.google.com/drive/folders/1CD6J7lh3XZlzTd88AjCnveswjOvHbajx?usp=sharing)。FIR 與 IIR 實作內容位於第 15 週資料夾中。

## 參考資料

[FIR illustration](https://www.oreilly.com/library/view/digital-filters-design/9781905209453/ch007-sec002.html)

[IIR illustration](https://www.ni.com/docs/en-US/bundle/labview-digital-filter-design-toolkit-api-ref/page/lvdfdtconcepts/iir_sos_specs.html)
