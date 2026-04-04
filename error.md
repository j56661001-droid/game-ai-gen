// ============================================================================
// 1000-1999: 通用HTTP错误
// ============================================================================.
var (
	// 1000-1099: 基础HTTP错误.
	ErrNotFound         = New(404, 1000, "资源未找到")
	ErrBadRequest       = New(400, 1001, "请求参数错误")
	ErrMethodNotAllowed = New(405, 1002, "请求方法不允许")
	ErrUnsupportedMedia = New(415, 1003, "不支持的媒体类型")
	ErrTooLargeRequest  = New(413, 1004, "请求实体过大")
	ErrRequestTimeout   = New(408, 1005, "请求超时")

	// 1100-1199: 客户端错误.
	ErrClientClosed  = New(499, 1100, "客户端关闭连接")
	ErrInvalidJSON   = New(400, 1101, "JSON格式错误")
	ErrMissingHeader = New(400, 1102, "缺少必要的请求头")
	ErrInvalidHeader = New(400, 1103, "请求头格式错误")

	// 1500-1599: 服务器错误.
	ErrServerError        = New(500, 1500, "服务器内部错误")
	ErrNotImplemented     = New(501, 1501, "功能未实现")
	ErrServiceUnavailable = New(503, 1502, "服务不可用")
	ErrGatewayTimeout     = New(504, 1503, "网关超时")

	// 1900-1999: 其他通用错误.
	ErrUnknown = New(500, 1900, "未知错误")
	ErrFound   = New(302, 1901, "资源已找到")
)

// ============================================================================
// 2000-2999: 数据库相关错误
// ============================================================================.
var (
	// 2000-2099: 基础数据库错误.
	ErrDBConnection  = New(500, 2000, "数据库连接失败")
	ErrDBTransaction = New(500, 2001, "数据库事务错误")
	ErrDBDeadlock    = New(500, 2002, "数据库死锁")
	ErrDBTimeout     = New(500, 2003, "数据库操作超时")

	// 2100-2199: 数据验证错误.
	ErrDBDuplicate       = New(409, 2100, "数据重复")
	ErrDBConstraint      = New(400, 2101, "数据约束违反")
	ErrDBNullViolation   = New(400, 2102, "非空约束违反")
	ErrDBForeignKey      = New(400, 2103, "外键约束违反")
	ErrDBCheckConstraint = New(400, 2104, "检查约束违反")

	// 2200-2299: 数据操作错误.
	ErrDBRecordNotFound = New(404, 2200, "记录不存在")
	ErrDBRecordExists   = New(409, 2201, "记录已存在")
	ErrDBUpdateFailed   = New(500, 2202, "更新失败")
	ErrDBDeleteFailed   = New(500, 2203, "删除失败")
	ErrDBInsertFailed   = New(500, 2204, "插入失败")

	// 2900-2999: 其他数据库错误.
	ErrDBInternal  = New(500, 2900, "数据库内部错误")
	ErrDBMigration = New(500, 2901, "数据库迁移错误")
)

// ============================================================================
// 3000-3999: I/O和网络错误
// ============================================================================.
var (
	// 3000-3099: 基础I/O错误.
	ErrIOError        = New(500, 3000, "I/O操作错误")
	ErrFileNotFound   = New(404, 3001, "文件未找到")
	ErrFilePermission = New(403, 3002, "文件权限不足")
	ErrDiskSpace      = New(507, 3003, "磁盘空间不足")

	// 3100-3199: 网络错误.
	ErrNetworkTimeout     = New(504, 3100, "网络超时")
	ErrNetworkUnreachable = New(503, 3101, "网络不可达")
	ErrConnectionRefused  = New(503, 3102, "连接被拒绝")
	ErrDNSResolution      = New(503, 3103, "DNS解析失败")

	// 3600-3699: 外部服务错误.
	ErrExternalService = New(502, 3600, "外部服务错误")
	ErrExternalTimeout = New(504, 3601, "外部服务超时")
	ErrExternalAuth    = New(502, 3602, "外部服务认证失败")
)

// ============================================================================
// 4000-4999: 业务逻辑错误
// ============================================================================.
var (
	// 4000-4099: 基础业务错误.
	ErrBusinessLogic       = New(400, 4000, "业务逻辑错误")
	ErrInvalidOperation    = New(400, 4001, "无效操作")
	ErrOperationNotAllowed = New(403, 4002, "操作不被允许")
	ErrResourceConflict    = New(409, 4003, "资源冲突")

	// 4100-4199: 验证错误.
	ErrValidationFailed = New(422, 4100, "数据验证失败")
	ErrInvalidInput     = New(400, 4101, "输入参数无效")
	ErrMissingParameter = New(400, 4102, "缺少必要参数")
	ErrParameterRange   = New(400, 4103, "参数超出范围")
	ErrInvalidFormat    = New(400, 4104, "格式错误")
	ErrInvalidEmail     = New(400, 4105, "邮箱格式错误")
	ErrInvalidPhone     = New(400, 4106, "手机号格式错误")
	ErrInvalidURL       = New(400, 4107, "URL格式错误")

	// 4300-4399: 状态错误.
	ErrInvalidStatus   = New(400, 4300, "状态无效")
	ErrStatusConflict  = New(409, 4301, "状态冲突")
	ErrResourceLocked  = New(423, 4302, "资源被锁定")
	ErrResourceExpired = New(410, 4303, "资源已过期")

	// 4310-4319: 轮播图验证错误.
	ErrCarouselInvalidContentType = New(400, 4310, "轮播图内容类型无效")
	ErrCarouselInvalidOrder       = New(400, 4311, "轮播图显示顺序无效")
	ErrCarouselMissingTitle       = New(400, 4312, "轮播图标题不能为空")
	ErrCarouselInvalidMedia       = New(400, 4313, "轮播图媒体文件无效")
	ErrCarouselInvalidURL         = New(400, 4314, "轮播图链接格式无效")
	ErrCarouselInvalidDateRange   = New(400, 4315, "轮播图展示时间范围无效")

	// 4320-4329: 轮播图业务逻辑错误.
	ErrCarouselNotFound      = New(404, 4320, "轮播图不存在")
	ErrCarouselAlreadyExists = New(409, 4321, "轮播图已存在")
	ErrCarouselOrderConflict = New(409, 4322, "轮播图显示顺序冲突")
	ErrCarouselExceedsLimit  = New(400, 4323, "轮播图数量超出限制")
	ErrCarouselInactive      = New(400, 4324, "轮播图未激活")
)

// ============================================================================
// 5000-5999: 认证和授权错误
// ============================================================================.
var (
	// 5000-5099: 基础认证错误.
	ErrNeedLogin    = New(401, 5000, "需要登录")
	ErrAuthFailed   = New(401, 5001, "认证失败")
	ErrAuthExpired  = New(401, 5002, "认证已过期")
	ErrAuthInvalid  = New(401, 5003, "认证信息无效")
	ErrAuthMissing  = New(401, 5004, "缺少认证信息")
	ErrUnauthorized = New(401, 5005, "未授权")
	ErrForbidden    = New(403, 5006, "禁止访问")

	// 5100-5199: 登录相关错误.
	ErrAuthInvalidCredentials = New(401, 5100, "用户名或密码错误")
	ErrAuthAccountLocked      = New(423, 5101, "账户已被锁定")
	ErrAuthTooManyAttempts    = New(429, 5102, "登录尝试次数过多")
	ErrAuthAccountDisabled    = New(403, 5103, "账户已被禁用")
	ErrAuthAccountSuspended   = New(403, 5104, "账户已被暂停")
	ErrAuthAccountExpired     = New(403, 5105, "账户已过期")
	ErrAuthSessionExpired     = New(401, 5106, "会话已过期")
	ErrAuthSessionInvalid     = New(401, 5107, "会话无效")
	ErrAuthConcurrentLogin    = New(409, 5108, "账户在其他地方登录")

	// 5200-5299: 权限相关错误.
	ErrNoPermission               = New(403, 5200, "权限不足")
	ErrAuthInsufficientPrivileges = New(403, 5201, "权限不足")
	ErrAuthRoleRequired           = New(403, 5202, "需要特定角色")
	ErrAuthScopeRequired          = New(403, 5203, "需要特定权限范围")
	ErrAuthResourceDenied         = New(403, 5204, "资源访问被拒绝")
	ErrAuthOperationDenied        = New(403, 5205, "操作被拒绝")

	// 5300-5399: Token相关错误.
	ErrApiAuthInvalidToken     = New(401, 5300, "令牌无效")
	ErrApiAuthExpiredToken     = New(401, 5301, "令牌已过期")
	ErrApiAuthMalformedToken   = New(401, 5302, "令牌格式错误")
	ErrApiAuthTokenNotFound    = New(401, 5303, "令牌不存在")
	ErrApiAuthTokenRevoked     = New(401, 5304, "令牌已被撤销")
	ErrApiAuthTokenBlacklisted = New(401, 5305, "令牌已被拉黑")
	ErrApiAuthRefreshRequired  = New(401, 5306, "需要刷新令牌")
	ErrApiAuthRefreshFailed    = New(401, 5307, "令牌刷新失败")
	ErrAuthInvalidToken        = New(401, 5308, "重置令牌无效")
	ErrAuthTokenExpired        = New(401, 5309, "重置令牌已过期")

	// 5400-5499: 密码策略错误.
	ErrPasswordTooWeak        = New(422, 5400, "密码强度不足")
	ErrPasswordTooShort       = New(422, 5401, "密码长度不足")
	ErrPasswordTooLong        = New(422, 5402, "密码长度超出限制")
	ErrPasswordNoUppercase    = New(422, 5403, "密码必须包含大写字母")
	ErrPasswordNoLowercase    = New(422, 5404, "密码必须包含小写字母")
	ErrPasswordNoNumbers      = New(422, 5405, "密码必须包含数字")
	ErrPasswordNoSymbols      = New(422, 5406, "密码必须包含特殊字符")
	ErrPasswordForbiddenWord  = New(422, 5407, "密码包含禁用词汇")
	ErrPasswordReused         = New(422, 5408, "密码不能重复使用")
	ErrPasswordExpired        = New(422, 5409, "密码已过期")
	ErrPasswordChangeRequired = New(422, 5410, "需要更改密码")

	// 5500-5599: 多因素认证错误.
	ErrMFARequired         = New(428, 5500, "需要多因素认证")
	ErrMFAInvalidCode      = New(401, 5501, "多因素认证码无效")
	ErrMFAExpiredCode      = New(401, 5502, "多因素认证码已过期")
	ErrMFASetupRequired    = New(428, 5503, "需要设置多因素认证")
	ErrMFABackupCodeUsed   = New(401, 5504, "备用码已使用")
	ErrMFADeviceNotTrusted = New(403, 5505, "设备未受信任")

	// 5600-5699: OAuth相关错误.
	ErrOAuthInvalidRequest   = New(400, 5600, "OAuth请求无效")
	ErrOAuthInvalidClient    = New(401, 5601, "OAuth客户端无效")
	ErrOAuthInvalidGrant     = New(400, 5602, "OAuth授权无效")
	ErrOAuthUnsupportedGrant = New(400, 5603, "不支持的OAuth授权类型")
	ErrOAuthInvalidScope     = New(400, 5604, "OAuth权限范围无效")
	ErrOAuthAccessDenied     = New(403, 5605, "OAuth访问被拒绝")
	ErrOAuthStateMismatch    = New(400, 5606, "OAuth状态不匹配")
	ErrOAuthProviderError    = New(502, 5607, "第三方认证服务错误")
	ErrOAuthInvalidResponse  = New(502, 5608, "第三方认证响应无效")
	ErrOAuthCodeExpired      = New(400, 5609, "OAuth授权码已过期")

	// 5700-5799: 安全相关错误.
	ErrSecurityViolation  = New(403, 5700, "安全违规")
	ErrSuspiciousActivity = New(403, 5701, "检测到可疑活动")
	ErrIPBlocked          = New(403, 5702, "IP地址被阻止")
	ErrGeoBlocked         = New(403, 5703, "地理位置被阻止")
	ErrDeviceBlocked      = New(403, 5704, "设备被阻止")
	ErrRateLimitExceeded  = New(429, 5705, "请求频率超限")
	ErrCaptchaRequired    = New(428, 5706, "需要验证码")
	ErrCaptchaInvalid     = New(400, 5707, "验证码无效")
)

// ============================================================================
// 6000-6999: 用户管理错误
// ============================================================================.
var (
	// 6000-6099: 基础用户错误.
	ErrUserNotFound  = New(404, 6000, "用户不存在")
	ErrUserExists    = New(409, 6001, "用户已存在")
	ErrUserDisabled  = New(403, 6002, "用户已被禁用")
	ErrUserLocked    = New(423, 6003, "用户账户已被锁定")
	ErrUserSuspended = New(403, 6004, "用户已被暂停")
	ErrUserDeleted   = New(410, 6005, "用户已被删除")

	// 6100-6199: 用户验证错误.
	ErrUsernameExists   = New(409, 6100, "用户名已存在")
	ErrEmailExists      = New(409, 6101, "邮箱已被注册")
	ErrPhoneExists      = New(409, 6102, "手机号已被注册")
	ErrInvalidUsername  = New(400, 6103, "用户名格式无效")
	ErrUsernameTooShort = New(400, 6104, "用户名过短")
	ErrUsernameTooLong  = New(400, 6105, "用户名过长")
	ErrUsernameReserved = New(400, 6106, "用户名为保留词")

	// 6200-6299: 用户资料错误.
	ErrProfileIncomplete   = New(400, 6200, "用户资料不完整")
	ErrProfileUpdateFailed = New(500, 6201, "用户资料更新失败")
	ErrAvatarUploadFailed  = New(500, 6202, "头像上传失败")
	ErrAvatarTooLarge      = New(413, 6203, "头像文件过大")
	ErrAvatarInvalidFormat = New(400, 6204, "头像格式不支持")

	// 6300-6399: 用户状态错误.
	ErrUserNotVerified      = New(403, 6300, "用户未验证")
	ErrEmailNotVerified     = New(403, 6301, "邮箱未验证")
	ErrPhoneNotVerified     = New(403, 6302, "手机号未验证")
	ErrVerificationExpired  = New(410, 6303, "验证码已过期")
	ErrVerificationInvalid  = New(400, 6304, "验证码无效")
	ErrVerificationUsed     = New(400, 6305, "验证码已使用")
	ErrEmailAlreadyExists   = New(409, 6306, "邮箱已存在")
	ErrEmailAlreadyVerified = New(409, 6307, "邮箱已验证")

	// 6400-6499: 用户设置错误.
	ErrSettingsUpdateFailed = New(500, 6400, "设置更新失败")
	ErrInvalidSettings      = New(400, 6401, "设置参数无效")
	ErrSettingsConflict     = New(409, 6402, "设置冲突")

	// 6500-6599: 用户关系错误.
	ErrFriendRequestExists = New(409, 6500, "好友请求已存在")
	ErrFriendshipExists    = New(409, 6501, "已经是好友关系")
	ErrCannotAddSelf       = New(400, 6502, "不能添加自己为好友")
	ErrFriendLimitExceeded = New(400, 6503, "好友数量超出限制")
	ErrBlockedByUser       = New(403, 6504, "被用户屏蔽")
	ErrUserBlocked         = New(403, 6505, "用户已被屏蔽")
)

// ============================================================================
// 7000-7999: 预留给未来业务功能 (AI生成、积分系统等)
// ============================================================================.

// ============================================================================
// 8000-8999: 预留给未来业务功能 (AI生成、积分系统等)
// ============================================================================
// 此区间预留给后续开发的社交媒体平台功能使用

// ============================================================================
// 9000-9999: 系统和配置错误
// ============================================================================.
var (
	// 9000-9099: 基础系统错误.
	ErrSystemMaintenance   = New(503, 9000, "系统维护中")
	ErrSystemOverload      = New(503, 9001, "系统负载过高")
	ErrSystemUnavailable   = New(503, 9002, "系统不可用")
	ErrFeatureDisabled     = New(503, 9003, "功能已禁用")
	ErrFeatureNotAvailable = New(501, 9004, "功能不可用")

	// 9100-9199: 配置错误.
	ErrConfigInvalid       = New(500, 9100, "配置无效")
	ErrConfigMissing       = New(500, 9101, "配置缺失")
	ErrConfigLoadFailed    = New(500, 9102, "配置加载失败")
	ErrEnvironmentMismatch = New(500, 9103, "环境不匹配")

	// 9200-9299: 缓存错误.
	ErrCacheUnavailable = New(503, 9200, "缓存服务不可用")
	ErrCacheTimeout     = New(504, 9201, "缓存操作超时")
	ErrCacheKeyNotFound = New(404, 9202, "缓存键不存在")
	ErrCacheExpired     = New(410, 9203, "缓存已过期")

	// 9300-9399: 队列错误.
	ErrQueueUnavailable = New(503, 9300, "队列服务不可用")
	ErrQueueFull        = New(503, 9301, "队列已满")
	ErrQueueTimeout     = New(504, 9302, "队列操作超时")
	ErrJobFailed        = New(500, 9303, "任务执行失败")
	ErrJobNotFound      = New(404, 9304, "任务不存在")

	// 9400-9499: 监控和日志错误.
	ErrMetricsUnavailable = New(503, 9400, "监控服务不可用")
	ErrLogWriteFailed     = New(500, 9401, "日志写入失败")
	ErrAuditLogFailed     = New(500, 9402, "审计日志记录失败")

	// 9900-9999: 其他系统错误.
	ErrLicenseExpired = New(402, 9900, "许可证已过期")
	ErrLicenseInvalid = New(403, 9901, "许可证无效")
	ErrQuotaExceeded  = New(429, 9902, "配额已超出")
	ErrResourceLimit  = New(429, 9903, "资源限制")
)
