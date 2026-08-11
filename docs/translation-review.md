# 翻譯品質校對報告（2026-08-11）

## 範圍與方法

- **覆蓋**：`content/` 子模組全部 52 篇文章 + 4 個頁面的 zh↔en 配對（56 對）逐篇全文深讀。
- **執行**：7 個平行審閱者各依同一契約（準確性 / 自然度 / 術語 / 語域 四維 1-5、機翻偽影、證據型 issue 清單、需真人複核清單）評估後彙整。
- **修正**：高信度問題（錯字、文法、直譯套語、語意反轉）已直接套用於 content repo（**97 處 / 45 檔**）；主觀改寫與需專業複核者僅列入報告。

## 總體結果

| 類別 | 篇數 | 平均總評（1-5） |
|---|---|---|
| 全體 | 56 | ≈4.3 |
| 醫療 | 17 | ≈4.3 |
| 技術 | 11 | ≈4.2 |
| 個人反思 | 17 | ≈4.3 |
| 詩作 | 7 | ≈3.6（受 1 篇佔位文拖累） |

總評分佈：**5 分 7 篇、4 分 48 篇、1 分 1 篇**。四維平均（約略）：準確性 ≈4.5、自然度 ≈4.3、術語 ≈4.4、語域 ≈4.6——**整體品質高，問題集中在「個別詞句的直譯腔」而非結構性錯誤**。

滿分（5/5）七篇：〈安寧病房的病人 - 小惠〉〈實習醫師 Intern 的日子 - 神經內科心得〉〈實習醫師的日子 - 婦產科心得〉〈可能的最後一次病房值班，微記錄〉〈一個醫學生對社會的質疑〉〈台灣尤塞氏症暨視聽弱協會…開幕致詞〉〈成大通識領袖論壇-哲學、人生、社會 演講心得〉。

## 已套用修正（97 處 / 45 檔）

代表性案例，依類型：

**語意級誤譯（已修）**
- 2019 回顧：`NCKU Institute of Medical Informatics` → `Institute of Computer Science and Information Engineering`（「成大資工所」誤成「成大醫學資訊所」）
- HomeLab：`tracking dramas` → `binge-watching dramas…`（「追劇」逐字直譯失義）
- AirPods Pro 2：會議「切換到手機去上洗手間」的自相矛盾句重寫
- 夏醫學系長灘島：`medical department` → `medical school`
- 不是所有眼淚：「被觸動的心」由 `hardened heart`（堅硬的）改回原文的柔軟意象
- 眼科驚魂記：`Do... do... do...` → `Ring... ring... ring...`、`safely hand over` → `trustingly hand over`
- Windows/MacOS 2024：`I suspect myself that` → `I suspect that`、`accumulate into` → `accumulate over time`

**直譯套語（已修）**
- `runs naked` → `left completely exposed`；`lion's vomit method` → `Lion's Purge`；`stirring up a pool of spring water` → `stirring things up`；`glass heart` → `fragile heart`；`lazy packet` → `plain-language explainer`；`passive thoughts` → `pessimistic thinking`；`unfluent` → `halting`；`half-crippled` → `half-baked`（多檔）
- 2024：`genetic defect on USH2A` → `in USH2A`；`opiate withdrawal` → `opioid withdrawal`；`impotence drug` → `erectile dysfunction (ED) drug`；`desensitize` → `anonymize`

**文法/拼寫/標點（已修）**
- `an/a … software`（開發頁約 4 處）→ 移除冠詞；`EBM Based medicine` → `evidence-based medicine (EBM)`；`inject throat` → `injected (inflamed) throat`；`where Interns lack` → `fall short`；`email client` → `clients`；`expensively priced` → `expensive`
- `Virtualbox` → `VirtualBox`；`Tensorflow` → `TensorFlow`；`SetApp` → `Setapp`；`Hairy` → `Fluffy`（毛茸茸暱稱，15 處）
- 保留中文殘留：`(御姐)` → `onee-san`；`(學長)/(學弟)` 括註移除

## 重大發現

### 1. 〈詩文 - 等不到的守候〉正文曾為佔位符（已找回 ✔）
原報告時 zh 與 en 兩檔正文都只有 `a`，屬內容遺失。已透過 **Internet Archive Wayback Machine** 找到 2016 年原頁存檔（`blog.gbanyan.net/2016/08/23/no-responding-waiting/`，Ghost 時期）並完整還原中文原詩 + 補上英文譯文。zh/en 檔案與配對驗證已完成，`Awaiting.jpg` 特圖一路保留。

### 2. 醫學術語與專有名詞（需作者複核，報告期未更動）

**已依作者回覆修正（2026-08-11 二輪）**：#1「多分化型潛能細胞」→「多能幹細胞」且 en `multipotent`→`pluripotent`；#3 zh「亞伯氏症候群」→「Alport 症候群」（zh 筆誤）；#6 協會官方英名確認為 **Taiwan Usher Syndrome and Audiovisual Impairment Association**（官網 footer / about 載明，`Deafblind` 為誤）並全站統一；#10 靖永皓 → `Yung-Hao Ching`（慈濟官方頁）、蔡孟哲 → `Meng-Che Tsai`（成大官方頁，原譯已正確）。

仍待作者裁決：#2 血鈣「14.5 mg」是否補 `/dL` 及 SAAG/PTHi 判讀複核；#4「第五類」定義確認；#5 denervation supersensitivity 術語；#7 期刊《科技、醫療與社會》官方刊名；#8 安寧團隊「學姊」角色；#9 Mooink 字型英名；#11 無障礙之家官方名；#12 暢網 Changwang 拼音。
| 位置 | 項目 |
|---|---|
| 2016 視網膜 | zh「多分化型潛能細胞」拼寫疑誤 → multipotent vs pluripotent stem cells？ |
| Case Report | 血鈣 14.5 單位是否為 mg/dL；SAAG/PTHi 判讀 |
| 201976 演講 | 亞伯氏症候群 = Alport（譯文）或 Apert（字面）？；人名羅馬拼音（蔡孟哲、靖永皓/浩） |
| 安寧病房 | 「學姊」譯為 senior resident 屬角色推定，團隊成員（護理師/專科護理師）未必 |
| 親愛的醫生 | 「第五類確定癌症」已改 `Class V`（癌症無 Stage V），但第五類的實際分類含義需確認 |
| 2019 回顧 | 麻州住院醫師手冊（MGH…）、《The ICU Book》所指書名 |
| 2023 / 致詞 | 台灣尤塞氏症暨視聽弱協會官方英名（Deafblind 是否貼切） |
| 科技與社會論文 | 期刊《科技、醫療和社會》官方英文刊名 |
| 書摘 | denervation supersensitivity 術語與原書（日文版）對照 |
| 關於作者 / HomeLab | 靖永皓拼音、無障礙之家、暢網 Changwang 官方名 |
| Mooink | 華康字型英名 `DFBing*` 需對照裝置 UI（慣用 DF 前綴） |

### 3. 源文（zh）自身問題（非翻譯錯誤）
- `TIling` 錯字在中文源文（開發頁）；en 已正確。
- `露天購買HTC A9` 有 U+FFFC 空白字元（zh 亦有）。
- 「思而不行則殆」在 zh 為變體版本，en 恢復了論語通行文句——若變體是有意的，需在 en 保留「行」之意（見下）。

## 建議但保留未改（主觀 / 需作者定奪）
- **論語引句**：en 用了通行文句「thought without learning is perilous」，zh 原文實為「思而不行」。
- **詩作**：單詞級皆已修（見上）；但若干斷行/意象重組屬作者品味（如〈白日夢〉第一人稱化已改，〈生命旅人〉末節整句改寫已改）。
- **語感選詞**：`AI Taste → AI Flavor`、`顏值 → good looks`、`Minguo 101` 轉換等已依建議套用；若偏好其他用詞可再調。

## 追蹤
- 已修正內容推送到 `personal-blog` 後自動上線；本篇報告進主 repo `docs/`。
- 待辦（作者）：還原〈等不到的守候〉、複核上表 #2 各專業名詞。
