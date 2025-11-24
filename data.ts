import { Disease } from './types';

/**
 * Jiangxi Province Outpatient Chronic/Special Disease Recognition Standards
 * Full implementation of all 67 diseases.
 */

export const diseaseDatabase: Disease[] = [
  // 1-10
  {
    id: 1,
    name: "1. 恶性肿瘤门诊治疗（含白血病）",
    category: "肿瘤",
    logicDescription: "(1) + (2) + [(3) 或 (4) 任一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近二年内的放疗、化疗、手术治疗等抗肿瘤治疗记录 1 次或对症姑息治疗记录 1 次" },
      { id: "3", content: "病理报告、细胞学阳性检查或二级及以上医疗机构诊断恶性肿瘤的影像学报告单（CT 或 MRI）" },
      { id: "4", content: "其他与病种相关材料（CT、核磁共振、同位素、内窥镜）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && (ids.has("3") || ids.has("4"))
  },
  {
    id: 2,
    name: "2. 系统性红斑狼疮",
    category: "风湿免疫",
    logicDescription: "(1) + (2) + [(3)(4)(5)(6) 中任意两项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "系统受损相关检查报告单" },
      { id: "3", content: "抗核型贫血（白细胞减少、血小板减少）的血象报告单" },
      { id: "4", content: "尿蛋白或管型尿阳性报告单" },
      { id: "5", content: "抗核抗体阳性报告单" },
      { id: "6", content: "近二年内的相关免疫学阳性检查报告单" },
    ],
    isEligible: (ids) => {
      const count = ["3", "4", "5", "6"].filter(id => ids.has(id)).length;
      return ids.has("1") && ids.has("2") && count >= 2;
    }
  },
  {
    id: 3,
    name: "3. 地中海贫血（含输血）",
    category: "血液系统",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "具有小细胞低色素贫血的血常规报告" },
      { id: "3", content: "地中海贫血基因检测阳性检查报告" },
      { id: "4", content: "其他与疾病相关的近期肝功能（含黄疸指数）、肝脾 B 超、骨髓细胞学等检查报告" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 4,
    name: "4. 再生障碍性贫血",
    category: "血液系统",
    logicDescription: "(1) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "骨髓细胞学检查或骨髓活检报告单" },
      { id: "3", content: "一次及以上二、三系血细胞减少" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3"))
  },
  {
    id: 5,
    name: "5. 血友病",
    category: "血液系统",
    logicDescription: "(1) + (2) + (3) + [(4)(5) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "凝血因子测定异常" },
      { id: "3", content: "凝血报告提示凝血时间延长、凝血酶源消耗不良" },
      { id: "4", content: "实验室全套：PT、APTT、TT 报告单" },
      { id: "5", content: "脏器或关节出血（畸变）的相关材料" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && (ids.has("4") || ids.has("5"))
  },
  {
    id: 6,
    name: "6. 帕金森氏综合症",
    category: "神经系统",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "有服用多巴胺类药物史" },
      { id: "3", content: "病史一年以上，有 3 次门诊或 1 次住院病历记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 7,
    name: "7. 慢性肾功能衰竭（尿毒症期）",
    category: "肾脏病",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "2 次以上的肾功能检查报告单（肾小球滤过率≤15ml/分或血肌酐≥707μmol/L）" },
      { id: "3", content: "门诊（住院）的腹透或血透治疗记录单" },
      { id: "4", content: "与病种相关的其他检查资料" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 8,
    name: "8. 器官移植抗排异治疗",
    category: "器官移植",
    logicDescription: "(1) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近二年内的 2 次连续服用抗排斥药物治疗记录" },
      { id: "3", content: "其他与病种相关的检查化验材料" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3"))
  },
  {
    id: 9,
    name: "9. 耐多药肺结核",
    category: "传染病",
    logicDescription: "(1) + [(2)(3) 中任意一项] (注：与结核病不同时享受)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "有 2 种或以上抗结核药耐药试验阳性" },
      { id: "3", content: "经定点医院证实利福平耐药，需门诊长期治疗，且既往有结核住院病史" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3"))
  },
  {
    id: 10,
    name: "10. 重性精神病",
    category: "精神卫生",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "专科医院或三甲综合医院出具并由2名副主任医师以上签署的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "有重性精神病诊断、检查、治疗材料，病程 2 年以上" },
      { id: "3", content: "符合重性精神病界定条件（精神分裂症、心境障碍、器质性精神障碍等）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },

  // 11-20
  {
    id: 11,
    name: "11. 儿童生长激素缺乏症",
    category: "内分泌",
    logicDescription: "(1) + (2) + (3) + (4) + (5)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "初次诊断病历记录" },
      { id: "3", content: "治疗前 X 线腕骨片报告单符合骨龄落后 1 年以上" },
      { id: "4", content: "近二年内分泌测试阳性结果" },
      { id: "5", content: "符合生长激素缺乏诊断的其他检查材料（如身高≤-2SD或IGF-1低下）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && ids.has("4") && ids.has("5")
  },
  {
    id: 12,
    name: "12. 高血压伴有并发症",
    category: "心脑血管",
    logicDescription: "(1) + (2) + [(3)至(7) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的证明，明确为高血压 2 级及以上" },
      { id: "2", content: "有治疗高血压的门诊记录 3 次或住院病历记录 1 次" },
      { id: "3", content: "近二年内显示心脏左室肥厚或心脏扩大或心功能不全" },
      { id: "4", content: "近二年内显示脑出血或脑梗塞的相关检查" },
      { id: "5", content: "近二年内显示肾功能不全的相关检查" },
      { id: "6", content: "近二年内显示眼底病变的相关检查" },
      { id: "7", content: "近二年内显示动脉硬化、增厚或狭窄的相关检查" },
    ],
    isEligible: (ids) => {
      const comp = ["3", "4", "5", "6", "7"].some(id => ids.has(id));
      return ids.has("1") && ids.has("2") && comp;
    }
  },
  {
    id: 13,
    name: "13. 冠心病",
    category: "心脑血管",
    logicDescription: "[(1)+(2)] 或 [(1)+(3)+(4)]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "冠状动脉造影显示有冠脉狭窄" },
      { id: "3", content: "心电图 ST、T 明显缺血性改变或负荷运动试验阳性" },
      { id: "4", content: "有心肌梗死住院病历记录" },
    ],
    isEligible: (ids) => {
      return (ids.has("1") && ids.has("2")) || (ids.has("1") && ids.has("3") && ids.has("4"));
    }
  },
  {
    id: 14,
    name: "14. 慢性心力衰竭",
    category: "心脑血管",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”（不能以疾病诊断证明书代替）" },
      { id: "2", content: "检查结果提示心脏病变（心电图、X线、造影、超声等）" },
      { id: "3", content: "近二年内心脏彩超提示心脏舒缩异常" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 15,
    name: "15. 心肌病",
    category: "心脑血管",
    logicDescription: "(1) + (7) + [(2)至(6) 中任意两项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "心脏超声检查提示心肌肥厚或心脏扩大" },
      { id: "3", content: "心电图检测显示心律失常" },
      { id: "4", content: "出现充血性心力衰竭症状" },
      { id: "5", content: "肌酶谱检查显示心肌受损" },
      { id: "6", content: "其他影像和实验室检查能提示心肌病的" },
      { id: "7", content: "近二年内 3 次门诊或 1 次住院记录" },
    ],
    isEligible: (ids) => {
      const count = ["2", "3", "4", "5", "6"].filter(id => ids.has(id)).length;
      return ids.has("1") && ids.has("7") && count >= 2;
    }
  },
  {
    id: 16,
    name: "16. 糖尿病伴有并发症",
    category: "内分泌",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近一年内 3 次使用降糖药或胰岛素的门诊记录或 1 次住院病历记录" },
      { id: "3", content: "提供肾功能报告单或眼底造影或肌电图或神经检查阳性报告单" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 17,
    name: "17. 慢性支气管炎",
    category: "呼吸系统",
    logicDescription: "(1) + (4) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近二年内的影像阳性报告单" },
      { id: "3", content: "痰检阳性报告单" },
      { id: "4", content: "两年以上病程，3 次门诊或 1 次住院记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("4") && (ids.has("2") || ids.has("3"))
  },
  {
    id: 18,
    name: "18. 慢性阻塞性肺疾病",
    category: "呼吸系统",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近二年内的肺功能阳性报告单" },
      { id: "3", content: "近二年内的胸片阳性报告单" },
      { id: "4", content: "近二年内的 CT 阳性报告单" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 19,
    name: "19. 支气管哮喘",
    category: "呼吸系统",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的近 3 年“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "半年以上 3 次门诊或 1 次住院记录" },
      { id: "3", content: "支气管舒张试验、激发试验、运动试验阳性或昼夜 PEF 变异率≥20%" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 20,
    name: "20. 癫痫",
    category: "神经系统",
    logicDescription: "(1) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”（不能以疾病诊断证明书代替）" },
      { id: "2", content: "半年以上 3 次门诊或 1 次住院治疗记录" },
      { id: "3", content: "脑电图检查阳性报告单" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3"))
  },
  // 21-30
  {
    id: 21,
    name: "21. 脑卒中",
    category: "神经系统",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”（不能以疾病诊断证明书代替）" },
      { id: "2", content: "至少一次脑 CT 或 MRI 检查报告单（明确显示有出血或梗塞）" },
      { id: "3", content: "住院治疗出院后 3 个月以上仍有未恢复的明显后遗症（运动、语言、智力障碍等）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 22,
    name: "22. 重症肌无力",
    category: "神经系统",
    logicDescription: "(1) + [(2)(3)(4)(5) 中任意一项]",
    criteria: [
      { id: "1", content: "三级医疗机构出具的“出院小结”（不能以疾病诊断证明书代替）" },
      { id: "2", content: "肌电图异常报告或重频电制激异常" },
      { id: "3", content: "病理诊断提示肌纤维改变、神经肌肉接头处改变、胸腺病变" },
      { id: "4", content: "血清自身抗体阳性报告单" },
      { id: "5", content: "其他辅助实验阳性报告单（肌疲劳实验、腾喜龙试验等）" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4") || ids.has("5"))
  },
  {
    id: 23,
    name: "23. 慢性肝炎",
    category: "传染病",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近二年内 3 次门诊或 1 次住院治疗病历记录" },
      { id: "3", content: "病毒性肝炎阳性检查报告 2 次并有一次核酸检查阳性" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 24,
    name: "24. 肝硬化",
    category: "消化系统",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "肝硬化影像学检查阳性报告" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 25,
    name: "25. 慢性肾脏病",
    category: "肾脏病",
    logicDescription: "(1) + (6) + [(2)(3)(4)(5) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "2 次以上的尿检异常（血尿、蛋白尿、管型尿）" },
      { id: "3", content: "有水肿及高血压病史" },
      { id: "4", content: "肾功能受损或肾功能衰竭（CKD G2-G4 分期）的检查报告单" },
      { id: "5", content: "肾活检病理检查阳性报告单" },
      { id: "6", content: "半年以上的累计 3 次门诊或 1 次住院病历记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("6") && (ids.has("2") || ids.has("3") || ids.has("4") || ids.has("5"))
  },
  {
    id: 26,
    name: "26. 结核",
    category: "传染病",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "结核菌病原性检测阳性报告" },
      { id: "3", content: "近一年内服用抗结核药物记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 27,
    name: "27. 精神病",
    category: "精神卫生",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "专科或三甲医院主治医师以上出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "连续一年以上 3 次门诊或 1 次住院治疗精神病病历" },
      { id: "3", content: "排除其他器质性、症状性、中毒性等所致的应急性精神症状" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 28,
    name: "28. 心房颤动",
    category: "心脑血管",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "至少两次心电图提示房颤或 24 小时动态心电图提示房颤" },
      { id: "3", content: "近二年来 3 次门诊或 1 次住院病历" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 29,
    name: "29. 儿童孤独症",
    category: "精神卫生",
    logicDescription: "(1)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”或“疾病诊断证明书”" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  {
    id: 30,
    name: "30. 克罗恩病",
    category: "消化系统",
    logicDescription: "(1) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "肠镜检查或 CT、X 线报告提示克罗恩病" },
      { id: "3", content: "病理结果（内镜活检或手术标本）提示克罗恩病" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3"))
  },
  // 31-40
  {
    id: 31,
    name: "31. 强直性脊柱炎",
    category: "风湿免疫",
    logicDescription: "(1) + [(2)(3)(4)(5) 中任意两项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "骶髂关节影像学检查阳性报告单（关节炎II~IV级）" },
      { id: "3", content: "血液检查血小板升高、贫血、血沉增快或 C 反应蛋白升高" },
      { id: "4", content: "HLA-B27 基因检测阳性" },
      { id: "5", content: "影像检查病变部位阳性报告单" },
    ],
    isEligible: (ids) => {
        const count = ["2", "3", "4", "5"].filter(id => ids.has(id)).length;
        return ids.has("1") && count >= 2;
    }
  },
  {
    id: 32,
    name: "32. 重度骨质疏松症",
    category: "骨科",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "DXA 测定 T 值≤-2.5 且伴有脆性骨折" },
      { id: "3", content: "无脆性骨折，但 DXA 测定 T 值≤-3.0" },
      { id: "4", content: "QCT 腰椎骨密度≤80mg/cm3" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 33,
    name: "33. 阿尔茨海默病",
    category: "神经系统",
    logicDescription: "(1) + [(2)(3)(4)(5) 任意两项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "脑部 CT 或 MRI 检查，显示脑室增大及脑沟变宽或脑萎缩" },
      { id: "3", content: "一年以上老年痴呆病史" },
      { id: "4", content: "六个月以上 3 次门诊或 1 次住院病历记录" },
      { id: "5", content: "通过神经系统检查及脑电图、CT 检查排除其他原因痴呆" },
    ],
    isEligible: (ids) => {
        const count = ["2", "3", "4", "5"].filter(id => ids.has(id)).length;
        return ids.has("1") && count >= 2;
    }
  },
  {
    id: 34,
    name: "34. 类风湿性关节炎",
    category: "风湿免疫",
    logicDescription: "(1) + (2) + [(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "影像学检查提示皮下结节或关节骨质破坏、滑膜增生等关节异常改变" },
      { id: "3", content: "实验室检查类风湿因子阳性（滴度>1:20）" },
      { id: "4", content: "其他辅助实验室检查阳性（ADF, CCP, AKA等）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && (ids.has("3") || ids.has("4"))
  },
  {
    id: 35,
    name: "35. 青光眼",
    category: "眼科",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "青光眼相关检查（视野、视神经 OCT、眼底照相的 C/D 比值）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 36,
    name: "36. 骨关节炎",
    category: "骨科",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "住院病历或半年以上的 3 次门诊病历，有明确诊断" },
      { id: "3", content: "影像学表现：骨质增生、关节间隙变窄、软骨下骨硬化等（软骨下骨质致密为必须条件）" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 37,
    name: "37. 儿童脑瘫",
    category: "神经系统",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "年龄≤14 岁，需长期门诊康复治疗" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 38,
    name: "38. 肝豆状核变性",
    category: "内分泌",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "三级医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "具有锥体外系症状、K-F 环阳性、血清 CP 低于正常及尿铜升高" },
      { id: "3", content: "具有肝病症状，K-F 环阳性、血清 CP 低于正常及尿铜升高" },
      { id: "4", content: "基因诊断阳性" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 39,
    name: "39. 慢性心律失常",
    category: "心脑血管",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "室性早搏＞10000/24 小时或室性早搏数＞10% 24 小时心搏数" },
      { id: "3", content: "室速或室颤" },
      { id: "4", content: "需要安装心脏起搏器的缓慢性心律失常" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 40,
    name: "40. 慢性萎缩性胃炎",
    category: "消化系统",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "三级医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "三级医疗机构病理提示有胃粘膜中度以上萎缩或肠化" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  // 41-50
  {
    id: 41,
    name: "41. 系统性硬皮病",
    category: "风湿免疫",
    logicDescription: "(1) + [(2)(3)(4) 任意一项]",
    criteria: [
      { id: "1", content: "三甲医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "X 光检查：肺纤维化、食道运动功能障碍等内脏改变" },
      { id: "3", content: "肺动脉高压或肾脏病变" },
      { id: "4", content: "免疫学检测：抗 Scl-70（+），抗着丝点抗体（+）或抗核抗体（+）" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 42,
    name: "42. 运动神经元病（肌萎缩侧索硬化）",
    category: "神经系统",
    logicDescription: "(1)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构神经内科专科出具的“出院小结”和“疾病诊断证明书”（两者必不可少）" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  {
    id: 43,
    name: "43. 多发性肌炎",
    category: "风湿免疫",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构神经内科专科出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "具备肌炎特异性抗体阳性" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 44,
    name: "44. 慢性骨髓炎",
    category: "骨科",
    logicDescription: "(1) + (2) + (3) + (4)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "提供急性骨髓炎或开放性骨折病史记录" },
      { id: "3", content: "X 线及其他影像学检测阳性报告" },
      { id: "4", content: "病变部位病历及实验室检查阳性报告" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && ids.has("4")
  },
  {
    id: 45,
    name: "45. 甲状腺功能减退症",
    category: "内分泌",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "血清甲状腺激素测定水平低于正常值+促甲状腺素（TSH）升高" },
      { id: "3", content: "3 个月以上的 3 次门诊诊疗记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 46,
    name: "46. 甲状腺功能亢进症",
    category: "内分泌",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”（排除特定禁忌症）" },
      { id: "2", content: "二甲以上医疗机构甲状腺素测定（T3、T4、FT3、FT4、TSH）提示甲亢" },
      { id: "3", content: "3 个月以上 3 次门诊诊疗记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 47,
    name: "47. 骨髓增生异常综合征",
    category: "血液系统",
    logicDescription: "(1) + [(2)(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "三级甲等医疗机构血液科专科出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "至少三次以上血象提示持续（≥6 月）一系或多系血细胞减少" },
      { id: "3", content: "骨髓实验室检测提示异常（原始细胞、染色体等）" },
      { id: "4", content: "其他辅助检查：流式细胞术、基因芯片、CFU集落形成减少等" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4"))
  },
  {
    id: 48,
    name: "48. 血小板减少性紫癜",
    category: "血液系统",
    logicDescription: "(1) + (2) + (3) + (4)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "至少三次以上检查血小板低于正常值" },
      { id: "3", content: "影像学检查脾脏不增大或仅轻度增大" },
      { id: "4", content: "骨髓检查巨核细胞正常增多，有成熟障碍" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && ids.has("4")
  },
  {
    id: 49,
    name: "49. 消化性溃疡",
    category: "消化系统",
    logicDescription: "(1) + (4) + [(2)(3) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "内镜检查阳性报告" },
      { id: "3", content: "X 线钡餐检查阳性报告单" },
      { id: "4", content: "近一年的 3 次门诊治疗记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("4") && (ids.has("2") || ids.has("3"))
  },
  {
    id: 50,
    name: "50. 子宫内膜异位症",
    category: "妇科",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构妇产科出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "临床病理阳性材料" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  // 51-60
  {
    id: 51,
    name: "51. 溃疡性结肠炎",
    category: "消化系统",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "肠镜、病理及影像学的相关检查报告" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 52,
    name: "52. 银屑病",
    category: "皮肤/风湿",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”或“疾病诊断证明书”，明确为中重度" },
      { id: "2", content: "中重度寻常型银屑病或关节型、脓疱型或红皮病型，且对传统治疗无效/禁忌" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 53,
    name: "53. 痛风",
    category: "风湿免疫",
    logicDescription: "(1) + (6) + [(2)(3)(4)(5) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "血尿酸测定男性>416μmol/L，女性>357μmol/L" },
      { id: "3", content: "血、尿常规及血沉提示异常" },
      { id: "4", content: "痛风关节 X 线等影像学检查阳性" },
      { id: "5", content: "痛风关节穿刺积液、结石实验室检测阳性" },
      { id: "6", content: "近三年 3 次门诊或 1 次住院治疗记录" },
    ],
    isEligible: (ids) => {
        const count = ["2", "3", "4", "5"].filter(id => ids.has(id)).length;
        return ids.has("1") && ids.has("6") && count >= 1;
    }
  },
  {
    id: 54,
    name: "54. 艾滋病",
    category: "传染病",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "HIV 检测阳性报告单" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 55,
    name: "55. 尘肺病",
    category: "呼吸系统",
    logicDescription: "(1) + (2) + (3) + (4) + (5)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近三年内典型的 X 光或胸部 CT" },
      { id: "3", content: "结合临床表现，排除其他类似肺部疾病" },
      { id: "4", content: "连续一年以上的 3 次门诊或 1 次住院治疗资料" },
      { id: "5", content: "非工伤患者" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && ids.has("4") && ids.has("5")
  },
  {
    id: 56,
    name: "56. 肺部非结核分枝杆菌病",
    category: "传染病",
    logicDescription: "(1) (出院小结和诊断证明必不可少)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”和“疾病诊断证明书”（两者必不可少）" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  {
    id: 57,
    name: "57. 颅内良性肿瘤辅助用药",
    category: "肿瘤",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "脑部 CT 或 MRI 提示良性脑瘤" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 58,
    name: "58. 变应性亚败血症（成人 still 病）",
    category: "风湿免疫",
    logicDescription: "(1)",
    criteria: [
      { id: "1", content: "三级甲等医疗机构风湿科出具的“出院小结”和“疾病诊断证明书”（两者必不可少）" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  {
    id: 59,
    name: "59. 股骨头坏死",
    category: "骨科",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "X 线、MRI 等影像学检查提示骨纹理细小或中断，囊肿、硬化、扁平或塌陷" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 60,
    name: "60. 苯丙酮尿症",
    category: "内分泌",
    logicDescription: "(1)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  // 61-67
  {
    id: 61,
    name: "61. 泌尿系结石",
    category: "泌尿系统",
    logicDescription: "(1) + (2)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "泌尿系 CT 诊断结石大于 0.4 厘米" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2")
  },
  {
    id: 62,
    name: "62. 原发性慢性肾上腺皮质功能减退症",
    category: "内分泌",
    logicDescription: "(1) + (2) + [(3)(4) 中任意一项]",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "血、尿皮质醇水平测定低于正常值的检查报告" },
      { id: "3", content: "其他辅助检查报告（ACTH升高、兴奋试验异常、CT异常、抗体阳性等）" },
      { id: "4", content: "近二年内因艾迪生病的 3 次门诊或 1 次住院治疗记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && (ids.has("3") || ids.has("4"))
  },
  {
    id: 63,
    name: "63. 皮质醇增多症",
    category: "内分泌",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "实验室检测库欣综合征阳性报告（血清皮质醇、24hUFC、DST 等）" },
      { id: "3", content: "近二年内因库欣综合征的 3 次门诊或 1 次住院治疗记录" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  },
  {
    id: 64,
    name: "64. 多发性硬化病",
    category: "神经系统",
    logicDescription: "(1) + [(2)(3)(4)(5) 中任意一项]",
    criteria: [
      { id: "1", content: "三级甲等医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "近一年的 3 次门诊或 1 次住院治疗记录" },
      { id: "3", content: "影像学检查中枢神经系统多发性病灶" },
      { id: "4", content: "脑脊液检查存在自身免疫性炎症反应" },
      { id: "5", content: "电生理检查存在脱髓鞘病变异常" },
    ],
    isEligible: (ids) => ids.has("1") && (ids.has("2") || ids.has("3") || ids.has("4") || ids.has("5"))
  },
  {
    id: 65,
    name: "65. 血吸虫病",
    category: "传染病",
    logicDescription: "(1)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
    ],
    isEligible: (ids) => ids.has("1")
  },
  {
    id: 66,
    name: "66. 肺动脉高压",
    category: "心脑血管",
    logicDescription: "(1) + (2) + (3) + (4)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "右心导管检查：静息平均肺动脉压≥25mmHg" },
      { id: "3", content: "超声心动图检查：肺动脉收缩压≥40 mmHg" },
      { id: "4", content: "胸片检查显示肺动脉高压症" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3") && ids.has("4")
  },
  {
    id: 67,
    name: "67. 特发性肺间质纤维化",
    category: "呼吸系统",
    logicDescription: "(1) + (2) + (3)",
    criteria: [
      { id: "1", content: "二级及以上医疗机构出具的“出院小结”或“疾病诊断证明书”" },
      { id: "2", content: "CT 报告单：提示典型特发性肺纤维化表现" },
      { id: "3", content: "肺功能报告：提示限制性通气功能障碍、弥散量降低" },
    ],
    isEligible: (ids) => ids.has("1") && ids.has("2") && ids.has("3")
  }
];
