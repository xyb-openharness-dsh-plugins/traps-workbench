/* TRAPS 疾病概要：解释层内容；资料访问日 2026-11-16。 */
window.DISEASE_PRIMER = {
  brand: 'TRAPS 工作台（占位名，待用户追认）',
  name: '肿瘤坏死因子受体相关周期性综合征（TRAPS）',
  en: 'TNF Receptor-Associated Periodic Syndrome',
  updated: '2026-11-16',
  sections: [
    {
      id: 'definition', title: '定义',
      intro: 'TRAPS 是与 TNFRSF1A 基因相关的单基因自炎症综合征，可表现为反复发作的全身炎症。发作的持续时间、表现和间隔在人与人之间不同；页面记录的是医学资料的一般描述，不判断个人是否属于某个临床亚型。',
      points: [
        'GeneReviews 描述的发作常持续数天至数周，表现可能包括发热、肌肉痛、皮疹、腹部或胸部不适、眼部表现等；个体经历并不相同。',
        '诊断信息需结合临床表现与 TNFRSF1A 遗传检测。遗传变异分类、检测阴性或意义未明均不能由本工作台解释为个人诊断或家族风险。',
        '此概要属于一般资料解释，不用于判断症状原因、发作危险性或是否需要就医。'
      ],
      sources: [
        { org: 'NIH / NCBI Bookshelf', doc: 'GeneReviews: TNF Receptor-Associated Periodic Fever Syndrome', version: '在线章节，访问 2026-11-16', entry: true, url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '章节页面，二次综述来源；并非本项目取得的 PDF 原件。' }
      ]
    },
    {
      id: 'evidence', title: '医学资料规范和指南情况',
      intro: '公开专业资料用于说明疾病与研究字段来源。指南不能替代个人诊疗；目前没有临床审核者参与本工作台审核。',
      table: {
        head: ['来源', '文件/资料', '版本/日期', '取得状态', '本工作台用途'],
        rows: [
          ['EULAR / ACR', 'IL-1 介导自炎症病诊断、管理和监测 Points to Consider（含 TRAPS）', '2021 声明，2022 发表', { text: '开放全文', kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9531906/' }, '一般医学边界与信息字段参考；未做临床审核'],
          ['NIH / NCBI', 'GeneReviews: TNF Receptor-Associated Periodic Fever Syndrome', '在线章节；访问 2026-11-16', { text: '官方章节入口（二次综述）', kind: 'hub', url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/' }, '概述疾病特征；未取得独立 PDF 原件'],
          ['NIH Clinical Studies', '94-HG-0105 自炎症疾病自然史研究', '登记页面；访问 2026-11-16', { text: '研究登记原页', kind: 'registry', url: 'https://clinicalstudies.info.nih.gov/protocoldetails.aspx?id=94-HG-0105' }, '仅做公开研究入口；状态需访问时复核'],
          ['中国本地指南', 'TRAPS 诊疗指南原件', '未取得', { text: '未取得原件，据二次来源', nolink: true, note: '本轮未找到可核验的本地指南原件，不引述其具体条款。' }, '本地适用性待临床审核']
        ]
      },
      points: [
        '指南原件与二次综述分开标注；本页拿到的链接应指向全文或登记原页。',
        '2021 EULAR/ACR 文件覆盖 CAPS、TRAPS、MKD 与 DIRA；其适用范围不等于每位患者的个人方案。',
        '患者访谈为 0，临床审核为 0；有关本地就医流程、中文资料和药物监管信息的结论均待验证。'
      ],
      sources: [
        { org: 'EULAR / ACR', doc: 'Points to Consider for Diagnosis, Management and Monitoring of IL-1 Mediated Autoinflammatory Diseases', version: '2021 / 2022', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9531906/', page: '页码待核' },
        { org: 'NIH / NCBI', doc: 'GeneReviews TRAPS chapter', version: '访问 2026-11-16', entry: true, url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '章节网页，二次综述；非原始研究' }
      ]
    },
    {
      id: 'landscape', title: '目前治疗全景概要',
      intro: '专业文献讨论的管理方向可能包括控制炎症的治疗、监测以及支持性照护。以下按受累器官与病情轻重排列；这里描述资料范围，不提供个人治疗选择。',
      groups: [
        { label: '炎症管理与持续监测', points: ['EULAR/ACR 文件讨论 IL-1 通路相关疾病的管理与纵向监测。', 'GeneReviews 汇总了治疗和随访资料。药物适用性、剂量、风险及调整均不由本工作台评估。'] },
        { label: '症状与生活记录', points: ['患者可记录发作起止、原始症状、日常活动影响、检验日期与报告来源。', '记录仅供本人回顾或与医生讨论，不构成症状分级或处理建议。'] },
        { label: '遗传与家庭资料', points: ['遗传报告需要保留原始来源和实验室解释；家庭成员信息敏感，默认私密。', 'VUS、未检测、未检出和报告未提供是不同状态，不据此推断家庭成员诊断。'] }
      ],
      points: ['列出某类治疗手段不代表任何一项适合你。是否治疗、如何监测或需要怎样的支持，需结合个人情况与医生讨论；这一句需要问你的医生。'],
      sources: [
        { org: 'EULAR / ACR', doc: 'Points to Consider for Diagnosis, Management and Monitoring of IL-1 Mediated Autoinflammatory Diseases', version: '2021 / 2022', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9531906/', page: '页码待核' },
        { org: 'NIH / NCBI', doc: 'GeneReviews TRAPS chapter', version: '在线章节；访问 2026-11-16', entry: true, url: 'https://www.ncbi.nlm.nih.gov/books/NBK586171/', note: '二次综述来源；未取得独立 PDF 原件。' }
      ]
    },
    {
      id: 'trend', title: '发展趋势',
      intro: '只列可核对的已发生事实，不作未来方向预测。',
      points: [
        '2022 年：EULAR/ACR 的 2021 Points to Consider 论文全文发表于《Annals of the Rheumatic Diseases》，范围包含 TRAPS 等 IL-1 介导自炎症病。',
        '截至 2026-11-16：GeneReviews 的 TRAPS 在线章节可通过 NCBI Bookshelf 访问；本工作台本次按二次综述标注。',
        '截至 2026-11-16：NIH Clinical Studies 页面列有 94-HG-0105 自炎症疾病自然史研究入口；招募状态与资格可能变化，需查看登记原页。'
      ],
      sources: [
        { org: 'Annals of the Rheumatic Diseases', doc: 'EULAR/ACR points to consider', version: '2022;81:907–921', original: true, kind: 'fulltext', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9531906/', page: '页码待核' },
        { org: 'NIH Clinical Studies', doc: 'Protocol 94-HG-0105', version: '访问 2026-11-16', original: true, kind: 'registry', url: 'https://clinicalstudies.info.nih.gov/protocoldetails.aspx?id=94-HG-0105' }
      ]
    }
  ]
}
