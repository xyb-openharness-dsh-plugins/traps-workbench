/* 内容依据 docs/CLINICAL-DATA-2026.md；证据编号见 docs/USER-RESEARCH.md 与本文件来源行。
   概要整体属第 ② 层（解释）：只整理公开信息与原文，不生成任何与你个人有关的判断。
   本节文字由人工撰写，尚未经临床审核。
   口径说明（2026-11-20 初版）：治疗全景段只保留「类别」级概述，不写具体药物选择、疗效、剂量、给药方案与移植指征；
   固定出口采用已登记的非肿瘤慢性病口径；趋势段只写已发生、有日期或版本号的事实。
   来源核验：2026-11-20 以 HTTP HEAD 实测本文件各直链（见各 note）。 */
window.DISEASE_PRIMER = {
  brand: '小热宝', name: '肿瘤坏死因子受体相关周期性综合征', en: 'TRAPS · TNF Receptor-Associated Periodic Syndrome', updated: '2026-11-20',
  sections: [
    {
      id: 'definition', title: '定义',
      intro: 'TRAPS（肿瘤坏死因子受体相关周期性综合征，旧称「家族性 Hibernian 热」）由 TNFRSF1A 基因的杂合致病变异引起，为常染色体显性遗传（外显率不完全）的遗传性周期性发热综合征。典型发作每次持续一到三周（文献报告多为 7–21 天），发作之间可间隔数周；常见表现包括游走性肌肉疼痛伴表面移动性红斑、眶周水肿、结膜炎、腹痛、关节痛等。多数在儿童期起病，也可成年起病。',
      points: [
        '致病基因：TNFRSF1A（12p13），编码 TNF 受体 1；杂合变异即可致病，家系中可连续多代出现（OMIM #142680）。',
        '发作长度是它区别于其他周期热的重要特征：TRAPS 发作常持续 7–21 天；家族性地中海热发作常只有 1–3 天，PFAPA 则约每 3–4 周规律发热伴咽炎、口疮或淋巴结炎。鉴别由医生完成，本台不做自测。',
        '患病率：二手来源估计约 1/100 万量级，为第二常见的遗传性周期性发热综合征；中国患病率未查到官方数字。',
        '诱因：多数发作没有明确诱因；文献提到部分发作与应激、轻微外伤或感染相关（观察性描述，非因果结论）。',
        '长期风险：持续性炎症可导致 AA 淀粉样变（肾脏最常受累），这是规范随访关注的原因之一。',
        '诊断依赖医生综合发作特征与 TNFRSF1A 基因检测；分类标准（Eurofever/PRINTO 2019）是给临床使用的分类工具，不是自测表。',
        '本项目患者访谈 0 次，临床审核 0 次；以下文字由人工整理，尚未经临床专业人员审核，不用于诊断或自我判断。'
      ],
      sources: [
        { org: 'NCI GeneReviews（NCBI Bookshelf）', doc: 'TNF Receptor-Associated Periodic Fever Syndrome（TRAPS）专章', version: 'Deuitch et al., 首版 2022-04-07，持续更新（本轮核对 2026-11-20）', original: true, kind: 'fulltext', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: 'HTTP 200 / text/html（2026-11-20 HEAD 核验）' },
        { org: 'MedlinePlus Genetics', doc: 'Tumor necrosis factor receptor-associated periodic syndrome', version: '现行页（本轮核对 2026-11-20）', original: true, kind: 'fulltext', url: 'https://medlineplus.gov/genetics/condition/tumor-necrosis-factor-receptor-associated-periodic-syndrome/', note: 'HTTP 200 / text/html；用于遗传方式与患病率表述' },
        { org: 'NORD', doc: 'TNF Receptor Associated Periodic Syndrome (TRAPS)', version: '现行页', original: true, kind: 'fulltext', url: 'https://rarediseases.org/rare-diseases/tumor-necrosis-factor-receptor-associated-periodic-syndrome/', note: 'HTTP 200；患者信息对照，不与 GeneReviews 拼接成自测' }
      ]
    },
    {
      id: 'evidence', title: '医学资料规范和指南情况',
      intro: '下表逐行说明本项目实际拿到了哪些文件的原件、哪些只拿到题录或二手来源，以及各自用来支持哪一块内容。未取得原件的行只记录「这份文件存在、大致讲什么」，不引用其中条文。',
      table: { head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'], rows: [
        ['NCI GeneReviews（NCBI）', 'TNF Receptor-Associated Periodic Fever Syndrome（TRAPS）专章', 'Deuitch et al., 2022 首版，持续更新',
          { text: '原件已取得：网页正文（NBK586171）', kind: 'fulltext', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/' },
          '定义、发作特征、诊断框架与治疗类别的引用依据'],
        ['MedlinePlus Genetics（NIH）', 'Tumor necrosis factor receptor-associated periodic syndrome', '现行页',
          { text: '原件已取得：网页正文', kind: 'fulltext', url: 'https://medlineplus.gov/genetics/condition/tumor-necrosis-factor-receptor-associated-periodic-syndrome/' },
          '遗传方式、患病率表述与患者可读背景'],
        ['PRINTO', 'TRAPS 家长手册（多语种患者资料 · 中文版）', '现行页',
          { text: '原件已取得：网页正文', kind: 'fulltext', url: 'https://www.printo.it/pediatric-rheumatology/CN/info/25' },
          '患者教育对照；儿童风湿病研究网络的患者手册'],
        ['Eurofever/PRINTO 分类标准（Gattorno et al.）', 'Classification criteria for autoinflammatory recurrent fevers', 'Ann Rheum Dis 2019;78(8):1025–1035',
          { text: '未取得原件，据二次来源：PubMed 题录', kind: 'registry', url: 'https://pubmed.ncbi.nlm.nih.gov/31018962/', note: '题录与摘要；出版社镜像直链返回 403，全文未取得' },
          '仅记录该分类标准存在与题录；不引用其中评分细则作自测'],
        ['Cudrici et al.', 'Revisiting TRAPS（综述）', '2020',
          { text: '原件已取得：PMC 全文页', kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7246474/', note: 'HTTP 200 / text/html' },
          '治疗类别与证据分层的背景（综述层面，非指南）'],
        ['Kuemmerle-Deschner et al.', '生物制剂用于遗传性周期热（系统综述）', '2020',
          { text: '原件已取得：PMC 全文页', kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7722275/', note: 'HTTP 200 / text/html' },
          '各生物制剂证据级别（RCT/队列/个案）的背景'],
        ['中国官方', 'TRAPS 专门指南 / 诊疗规范', '—',
          { text: '未查到：本轮公开检索未发现中国官方针对 TRAPS 的专门指南；国家《罕见病诊疗指南》系列未收录本病专门章节', nolink: true, note: '检索日期 2026-11-20；如后续取得官方原件将替换本条' },
          '如实记录缺口；取得官方原件后替换本条']
      ] },
      sources: [
        { org: 'NCI GeneReviews（NCBI）', doc: 'TRAPS 专章', version: '2022，持续更新', original: true, kind: 'fulltext', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '本轮核验 HTTP 200' },
        { org: 'MedlinePlus Genetics', doc: 'TRAPS', version: '现行页', original: true, kind: 'fulltext', url: 'https://medlineplus.gov/genetics/condition/tumor-necrosis-factor-receptor-associated-periodic-syndrome/', note: '本轮核验 HTTP 200' },
        { org: 'PRINTO', doc: 'TRAPS 家长手册（中文版）', version: '现行页', original: true, kind: 'fulltext', url: 'https://www.printo.it/pediatric-rheumatology/CN/info/25', note: '本轮核验 HTTP 200' },
        { org: 'PubMed', doc: 'Eurofever/PRINTO 2019 分类标准 · PMID 31018962', version: '2019', original: true, kind: 'registry', url: 'https://pubmed.ncbi.nlm.nih.gov/31018962/', note: '题录与摘要，不是全文；全文直链 403 未取得' },
        { org: 'PMC', doc: 'Revisiting TRAPS · PMC7246474', version: '2020', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7246474/', note: '综述全文页；HTTP 200 核验' }
      ]
    },
    {
      id: 'landscape', title: '目前治疗全景概要',
      intro: '下面按公开文献只列出治疗的类别与证据状态，不列具体药物选择、不给选择顺序、不写疗效数值与移植指征，也不判断哪一类适合谁。治疗目标、方案与随访节奏由医生按发作频率、严重程度、家族史与淀粉样变风险个体化决定，本台不写。',
      groups: [
        { label: '1 发作期对症处理（类别）', points: [
          '非甾体抗炎药：文献用于较轻发作的对症处理（专家共识/综述层面）。',
          '糖皮质激素：文献描述为发作期常用处理；长期使用的取舍由医生权衡（综述层面）。',
          '同一类里具体选哪种药、剂量、疗程、何时加减或换药，都属于处方与随访判断，本台不写。'
        ] },
        { label: '2 靶向生物制剂（类别）', points: [
          '抗 IL-1 通道（如卡那单抗）：有随机对照试验与注册研究背景；2016 年获美国 FDA 批准用于 TRAPS（见趋势段）。',
          '抗 TNF 通道（如依那西普）：文献为回顾性队列/病例系列层面，且疗效可随时间变化；本台不写具体方案。',
          '抗 IL-6 通道（如托珠单抗）：文献为个案/小样本报道层面。',
          '各通道的证据级别不同，以上仅记录文献分层，不构成任何推荐。'
        ] },
        { label: '3 长期管理与监测（类别）', points: [
          'AA 淀粉样变是长期关注的并发症；文献提到随访涉及肾功能、尿蛋白与血清淀粉样A蛋白等指标（按医嘱安排）。',
          '基因检测与家系遗传咨询：确诊与家系筛查由专业医生安排，本台只帮记录与准备。'
        ] },
        { label: '4 难治性个案（类别）', points: [
          '造血干细胞移植：文献仅个案/综述层面提及，未见指南级推荐；是否适用由专业中心评估，本台不写。'
        ] },
        { label: '固定出口', points: [
          '以上是文献里列出的手段类别，按受累器官与病情轻重排列（非肿瘤病种口径，已在本仓 SPEC 注明），不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
        ] }
      ],
      sources: [
        { org: 'NCI GeneReviews（NCBI）', doc: 'TRAPS 专章 · 治疗与监测（类别）', version: '2022，持续更新', original: true, kind: 'fulltext', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '只取类别框架；本台不抄具体药物选择、剂量与方案' },
        { org: 'PMC', doc: '生物制剂系统综述 · PMC7722275', version: '2020', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7722275/', note: '用于各通道证据级别的分层描述' },
        { org: 'Cudrici et al.', doc: 'Revisiting TRAPS · PMC7246474', version: '2020', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7246474/', note: '综述背景' }
      ]
    },
    {
      id: 'trend', title: '发展趋势',
      intro: '本段只列本轮核实到的、已经发生且有日期或版本号的事实，不写对将来的判断，也不评价哪一版更好。',
      points: [
        '2016-09-23 · 监管批件：美国 FDA 批准卡那单抗（Ilaris）用于 TRAPS、HIDS/MKD 与 FMF 三个周期热适应证（含 12 岁以下剂量方案）；来源为诺华官方新闻稿（原件已取得，HTTP 200）。中国审批情况另列。',
        '2019-04 · 分类标准发布：Eurofever/PRINTO 自身炎症性复发热分类标准发表（Ann Rheum Dis 2019;78(8):1025–1035，PMID 31018962）。全文未取得，据题录核对到发表信息。',
        '2022-04 · 权威资料体系：GeneReviews 建立 TRAPS 专章（NBK586171，Deuitch et al.），此后持续更新；本轮核对到现行版。',
        '2025（二手，待核）：二手行业报道显示截至 2025 年中卡那单抗尚未在中国境内获批；NMPA 数据库本轮未能直接检索确认，此条仅按二手来源记录，不作为结论。',
        '基因检测可及性：TNFRSF1A 已纳入多国临床实验室的常规自身炎症基因面板（文献与实验室页描述）；中国可及性的官方统计未查到。'
      ],
      sources: [
        { org: 'Novartis', doc: 'FDA approves expanded use of Ilaris for rare periodic fever syndromes（官方新闻稿）', version: '2016-09-23', original: true, kind: 'fulltext', url: 'https://www.novartis.com/us-en/news/media-releases/novartis-receives-three-new-fda-approvals-expanded-use-ilaris-patients-rare-periodic-fever-syndrome-conditions', note: 'HTTP 200 核验；FDA 批件事实以新闻稿表述为准' },
        { org: 'PubMed', doc: 'Eurofever/PRINTO 2019 分类标准 · PMID 31018962', version: '2019', original: true, kind: 'registry', url: 'https://pubmed.ncbi.nlm.nih.gov/31018962/', note: '题录与摘要，不是全文' },
        { org: 'NCI GeneReviews（NCBI）', doc: 'TRAPS 专章', version: '2022，持续更新', original: true, kind: 'fulltext', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '本轮核对到现行版' }
      ]
    }
  ]
};
