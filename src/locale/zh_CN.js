const zhCN = {
  'common.delete': '删除',
  'common.cancel': '取消',
  'common.confirm': '确定',
  'common.submite': '提交',
  'common.edit': '编辑',
  'common.deleteTip': '确定删除？',
  'common.guide': '产品介绍',
  'common.slogan': '全周期数据环境解决方案，提供命令行工具，支持场景管理，多端接入',
  'common.issue': '问题反馈',
  'common.input.invalid': '请修改输入的内容',

  'home.go': '立即开始',

  'home.icon.cloud': '云端部署',
  'home.icon.team': '团队协同',
  'home.icon.snapshot': '请求快照',
  'home.icon.dataflow': '数据流管理',
  'home.icon.quick': '开箱即用',
  'home.icon.scene': '多场景管理',
  'home.icon.continues': '全周期覆盖',
  'home.icon.document': '文档自动生成',
  'home.icon.versioning': '数据版本化',
  'home.icon.setting': '响应设置',
  'home.icon.database': '数据备份',
  'home.icon.save': '快速录入',
  'home.icon.decentration': '去中心化',
  'home.icon.api': '开放API',
  'home.icon.cli': '命令行工具',
  'home.icon.i18n': '多语言支持',
  'home.icon.github': '开源开放',

  'topNav.apiList': '接口列表',
  'topNav.realtimeList': '实时快照',
  'topNav.allProject': '所有项目',
  'topNav.projectConfig': '项目配置',

  'project.interfaceList': '接口列表',
  'project.realtimeList': '实时快照',
  'project.createApi': '请添加接口',
  'project.create': '创建新项目',
  'project.update': '更新项目',
  'project.name': '项目名称',
  'project.name.invalid': '请输入小写字母或者数字',
  'project.description': '项目描述',
  'project.description.invalid': '请输入项目描述',
  'project.add': '添加项目',

  'interfaceList.addInterface': '添加接口',
  'interfaceList.updateInterface': '修改接口',
  'interfaceList.searchInterface': '搜索接口',
  'interfaceList.interfacePathnameInput': '请输入接口 URL pathname',
  'interfaceList.interfaceDescription': '请输入接口描述',
  'interfaceList.interfaceMethod': '请输入请求方法',
  'interfaceList.invalidPathname': '请输入 path/name 或 path/:type/:id 字母用小写',
  'interfaceList.invalidDescription': '请输入接口描述',
  'interfaceList.invalidMethod': '请选择请求方法',

  'interfaceDetail.contextConfig': 'Rewrite response',
  'interfaceDetail.previewData': '预览场景数据（支持 GET|ALL 类型请求）',
  'interfaceDetail.proxyConfig': '代理模式',
  'interfaceDetail.schemaConfig': '字段描述配置',

  'sceneList.title': '场景管理',
  'sceneList.switchSceneHint': '点击场景进行切换：',
  'sceneList.switchSceneDisabledHint': '如需使用场景数据，请关闭代理模式',
  'sceneList.searchScene': '搜索场景',
  'sceneList.createScene': '新增场景',
  'sceneList.deleteScene': '删除场景',
  'sceneList.updateScene': '更新场景',
  'sceneList.sceneName': '场景名称',
  'sceneList.invalidSceneName': '格式不正确，请输入小写字母 数字 - _',
  'sceneList.sceneData': '场景数据',
  'sceneList.invalidSceneData': '格式错误，请输入 JSON 数据',

  'proxyConfig.enable.true': '代理模式已开启，自动转发请求',
  'proxyConfig.enable.false': '代理模式已关闭',
  'proxyConfig.addProxyUrl': '添加代理 Url 地址',
  'proxyConfig.invalidProxyUrl': '请输入 Url',
  'proxyConfig.switchProxyUrlHint': '点击 Url 进行切换：',

  'contextConfig.modify': '修改',
  'contextConfig.modifyProperty': '修改属性',
  'contextConfig.responseDelay': '响应延迟 {seconds} 秒',
  'contextConfig.responseDelayField': '响应延迟，单位秒',
  'contextConfig.responseStatus': '响应状态码',
  'contextConfig.invalidDelay': '请输入延迟时间，单位秒',
  'contextConfig.invalidStatus': '请输入状态码',

  // to be removed
  'fieldDes.req.title': 'Request字段描述',
  'fieldDes.res.title': 'Response字段描述',
  'fieldDes.isUseCheck': '是否开启校验',
  'fieldDes.field': '字段',
  'fieldDes.type': '类型',
  'fieldDes.required': '必须',
  'fieldDes.description': '说明',
  'fieldDes.operation': '操作',
  'fieldDes.pleaseInputArray': '请输入数组',
  'fieldDes.jsonFormatError': 'JSON 格式错误',

  'realtimeProject.myProject': '我的项目',
  'realtimeProject.detailPhoto': '详情快照',
  'realtimeProject.saveToScene': '保存到场景',
  'realtimeProject.inputPlacehold': '请输入场景名称',
  'realtimeProject.validError': '请输入合法字符',
  'realtimeProject.nullError': '请先添加项目或者接口',

  'document.resSchemaDes': '响应 Schema 描述',
  'document.reqSchemaDes': '请求 Schema 描述',
  'document.schemaDes': 'Schema 描述',
  'document.sceneData': '场景数据',
};

export default zhCN;
