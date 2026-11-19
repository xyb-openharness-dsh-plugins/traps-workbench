# 冻结合同 · schema/0001_initial.sql

- sha256: 456ab790b1cdcb56d8587bdb4dcdbed73422cada540c932514d60604bcf5598d
- 冻结日期: 2026-11-20
- 规则: 本文件冻结后只增不改；加结构只能新增 0002_*.sql（由 scripts/check-schema-words.mjs 与家族检查链把关）。
- 判定列断言: subjects / subject_records / trial_profile / saved_trial / app_setting 均无 diagnosis、risk_level、score 等判定列；
  试验符合度只读时计算，不落库。
- 语境: TRAPS（非肿瘤），无分期/线序语义；受累表现枚举见 trial_profile.organs_json 注释。
