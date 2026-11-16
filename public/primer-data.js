/* 36 号 · MPN 疾病概要数据（四段固定顺序：definition / evidence / landscape / trend）
   口径：解释层，不做个体判断；趋势段只写已发生事实；未取得原件写“未取得原件，据二次来源”。
   所有链接均为可点文件/官方入口；NCCN 临床版需自行登录，标 entry 不冒充原件。 */
window.DISEASE_PRIMER = {
  brand: '小髓宝',
  name: '骨髓增殖性肿瘤（MPN）',
  en: 'Myeloproliferative Neoplasms（PV / ET / PMF）',
  updated: '2026-11-15',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: '骨髓增殖性肿瘤（MPN）是一组起源于造血干细胞的克隆性疾病，骨髓里某一系或多系细胞持续增多。经典的三类是：真性红细胞增多症（PV）、原发性血小板增多症（ET）、原发性骨髓纤维化（PMF）；此外还有慢性中性粒细胞白血病、慢性嗜酸性粒细胞白血病和不能分类的 MPN 等。'
        + '它不是“血稠一点”这么简单，也不是每一种都会很快变成白血病；不同亚型的病程、血栓与出血风险、脾脏变化都不一样。本页只解释名词与已发表的事实，不判断你属于哪一种、也不判断轻重。',
      points: [
        'PV 的核心表现是红细胞总量增多，常伴 JAK2 V617F 或 JAK2 exon 12 突变；血栓是重要风险之一。',
        'ET 的核心表现是血小板持续增多，骨髓巨核细胞增多；JAK2、CALR、MPL 是常见驱动突变。',
        'PMF 的核心是骨髓纤维化与脾脏增大，可有贫血、疲劳、夜间盗汗、骨痛、早饱；诊断需要骨髓活检与分子检测。',
        '驱动突变不是“严重程度分数”。有突变帮助分类，但病情判断仍要看血细胞、脾脏、症状、骨髓和并发症。',
        '“MPN 不是一种病”这句话很重要：同一张化验单，在不同亚型里含义不同。'
      ],
      sources: [
        { org: 'WHO / Leukemia', doc: 'WHO Classification of Haematolymphoid Tumours, 5th ed.: Myeloid and Histiocytic/Dendritic Neoplasms', version: '2022', original: true, kind: 'fulltext', url: 'https://doi.org/10.1038/s41375-022-01613-1', page: '页码待核' },
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients · Myeloproliferative Neoplasms', version: '访问于 2026-11-15，版本以官网为准', original: true, kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/mpn-patient.pdf', page: '页码待核' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '这个工作台里出现的每一条“该查什么、可能有哪些手段”，都应能追到下面某一份文件。原件未取得的，在表里如实标出来，不假装看过；指南给的是“通常怎么做”，不是“你该怎么做”。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'],
        rows: [
          ['WHO', 'Classification of Haematolymphoid Tumours, 5th ed.（髓系与组织细胞/树突细胞）', '2022',
            { text: '已取得：DOI 全文入口', kind: 'fulltext', url: 'https://doi.org/10.1038/s41375-022-01613-1' },
            'MPN 亚型命名与诊断分类的出处'],
          ['NCCN', 'NCCN Guidelines for Patients · Myeloproliferative Neoplasms', '版本以官网为准（访问 2026-11-15）',
            { text: '已取得：患者版 PDF', kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/mpn-patient.pdf' },
            '患者可读的治疗全景与随访问题'],
          ['NCCN', 'NCCN Clinical Practice Guidelines · Myeloproliferative Neoplasms', '需登录查看',
            { text: '官方入口页（需自行注册/登录）', kind: 'hub', note: '本台未取得该版临床版全文，不引用其具体条文', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1477' },
            '只记录“存在这份文件”，不作为条文依据'],
          ['中国指南', '中华医学会血液学分会 MPN 相关诊疗指南', '未取得原件',
            { text: '未取得原件，据二次来源', nolink: true, note: '本轮未取得官方免费全文；中国可及性与适应证需另行核对，不写成结论' },
            '待补：中国实践与药物可及性']
        ]
      },
      points: [
        '版本号必须写清：同一份指南隔一年，条目会变。这里不复制大段指南原文，只留结构化摘要与来源。',
        'NCCN 临床版是登录制，本台没有该版全文；患者版 PDF 是公开文件，两者不是同一份文件。',
        '中国指南本轮未取得原件，因此本台不引用其条文；中国药物适应证只以 NMPA 批件与医生解释为准。',
        '本台 0 位临床医生审核。任何阈值、症状量表与提醒文案都标“待临床核对”。'
      ],
      sources: [
        { org: 'WHO', doc: 'WHO Classification, 5th ed.: Myeloid', version: '2022', original: true, kind: 'fulltext', url: 'https://doi.org/10.1038/s41375-022-01613-1', page: '页码待核' },
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients · MPN', version: '访问 2026-11-15', original: true, kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/mpn-patient.pdf', page: '页码待核' },
        { org: 'NCCN', doc: 'NCCN Clinical Practice Guidelines · MPN', version: '需登录', entry: true, url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1477', note: '官方入口页；本台未取得该版全文，需自行注册/登录查看' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: '下面按受累器官与病情轻重排列，列出指南与文献里出现过的治疗类别。这里没有治疗线序，也不是给你排的先后顺序；是否使用、何时使用、用哪一种，都由医生结合你的具体情况判断。',
      groups: [
        {
          label: '低危 / 以观察和风险控制为主',
          points: [
            'PV / ET 的低危患者，部分人以控制血细胞、降低血栓风险为目标；具体是否用药、用什么，属于医生判断。',
            'PV 可能涉及放血治疗；ET/PV 可能涉及低剂量阿司匹林等抗血小板策略，但是否适用要看出血风险与医生评估。',
            '观察不是“什么都不做”：血常规、脾脏、症状与血管事件仍要按医生安排的节奏随访。'
          ]
        },
        {
          label: '需要降细胞或靶向治疗时',
          points: [
            '降细胞治疗类别包括羟基脲、干扰素类等；不同亚型、年龄、生育计划与耐受性会影响选择。',
            'JAK 抑制剂（如芦可替尼等）用于部分 PV / ET / MF 患者，主要目标可能包括脾脏缩小与症状改善；适应证与剂量以批件和医生为准。',
            '其他 JAK 抑制剂与不同机制药物在不同国家、不同年份获批的适应证不完全相同；不要用“别人在用”推断自己适用。'
          ]
        },
        {
          label: '贫血、脾大与症状支持',
          points: [
            '贫血可能需要查铁、叶酸、维生素 B12、溶血等原因；是否输血、用促红细胞生成素或其他药物，需医生判断。',
            '脾脏明显增大或有压迫症状时，可能讨论药物、局部治疗或手术；这些选择有明确风险与条件。',
            '疲劳、瘙痒、骨痛、夜间盗汗、早饱等症状，有非药物与药物两类处理思路；本台只帮你记录，不给出处理建议。'
          ]
        },
        {
          label: '高危 / 进展与临床研究',
          points: [
            '部分高危或进展期 MF 患者会讨论异基因造血干细胞移植；是否适合、何时做，需要移植中心评估。',
            '临床试验是正式选项之一，不是“最后手段”；登记信息不等于入组资格，也不等于有效或安全。',
            '本台临床研究页只做字段对照与证据链展示，不判断你是否符合入组。'
          ]
        }
      ],
      points: [
        '以上是文献与指南里列出的手段，按受累器官与病情轻重排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。',
        '本页不写剂量，也不写自行调整用药。任何与你有关的决定，需要由你的医生结合完整资料判断。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients · MPN', version: '访问 2026-11-15', original: true, kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/mpn-patient.pdf', page: '治疗与随访章节，页码待核' },
        { org: 'WHO', doc: 'WHO Classification, 5th ed.: Myeloid', version: '2022', original: true, kind: 'fulltext', url: 'https://doi.org/10.1038/s41375-022-01613-1', page: '页码待核' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '这一段只写已经发生的事：哪份文件换了版本、哪一天生效、监管批了什么事、登记平台上多了什么。不写预测，不做评价，也不给任何倾向。',
      points: [
        '2022 年：WHO 第 5 版《造血与淋巴组织肿瘤分类》髓系分册发表，MPN 的亚型命名与诊断标准随之更新（Leukemia，2022）。',
        '2022 年：国际共识分类（ICC）发表，与 WHO 第 5 版并行存在；两套分类在部分命名与阈值上并不完全相同（Blood，2022；DOI 待补）。',
        '2023-09：美国 FDA 批准 momelotinib（OJJAARA）用于部分伴贫血的骨髓纤维化患者；批件与适应证以 FDA 原文为准。',
        '2026-10-05：本台使用的 CTV（ClinicalTrials.gov 本地索引）语料截止该日，共 1,434 条记录；这是索引截止日，不是全球试验截止日。',
        '2026-11-15：本台用 unified-trial-mcp 对 MPN 相关词做了一轮检索，CTV 返回 3 条登记记录；ChiCTR 在线与 WHO ICTRP 当轮 FAILED，不能据此说“没有研究”。'
      ],
      sources: [
        { org: 'WHO / Leukemia', doc: 'WHO Classification, 5th ed.: Myeloid', version: '2022', original: true, kind: 'fulltext', url: 'https://doi.org/10.1038/s41375-022-01613-1', page: '页码待核' },
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients · MPN', version: '访问 2026-11-15', original: true, kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/mpn-patient.pdf', page: '版本与更新页，页码待核' },
        { org: 'FDA', doc: 'Drug Trials Snapshots: OJJAARA (momelotinib)', version: '2023', entry: true, url: 'https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-ojjaara', note: '官方入口页；批件原文需在 FDA 站内自行检索/下载' },
        { org: 'ClinicalTrials.gov', doc: 'NCT07469891（本台快照中的一条 MPN 登记）', version: '2026-11-15 检索', original: true, kind: 'registry', url: 'https://clinicaltrials.gov/study/NCT07469891', page: '登记页' }
      ]
    }
  ]
}
