/**
 * 全局对象 : 保存配置和临时数据
 */
var ST = {
	/*
	 * **************** 验证码 *****************
	 */
	'sendCodeCountdown' : 60, // 验证码重新发送时间
	'allowedSendCode' : true, // 是否可以发送验证码
	/*
	 * **************** 提示框 *****************
	 */
	'tipEl' : null, // 提示框元素
	'tipTimerId' : null, // 提示框 timer id
	'tipAutohide' : 3000, // 自动隐藏时间
	/**
	 * **************** 注册表单 ****************
	 */
	'registerFormSendding' : false, // 注册表单是否正在提交
	'registerClause' : false, // 是否已同意条款
	/**
	 * **************** 预约 ****************
	 */
	'windowWidth' : 0, // 屏幕宽度
	/**
	 * **************** 我的订单 ****************
	 */
	'page' : 1, // 当前页码
	'loadingMore' : false, // 是否正在加载
	'container' : null, // 列表数据容器
	/**
	 * 解除绑定
	 */
	'unbinding' : false, // 是否正在发送解除绑定请求
	/**
	 * 手机号码输入框
	 */
	'mobileInput':'mobile'

};

/**
 * 显示提示框
 * type : success | error
 */
var showTip = function(msg, type) {

	type = type || 'success';

	clearTimeout(ST.tipTimerId);
	ST.tipEl.removeClass('tip_success tip_error').addClass('tip_' + type);
	ST.tipEl.text(msg).fadeIn();
	ST.tipTimerId = setTimeout(function() {
		ST.tipEl.fadeOut();
	}, ST.tipAutohide);
};

/**
 * 发送验证码
 */
var sendCode = function() {

	var timerId, timer, time, elText;
	var el = $(this);
	var STKey = 'allowedSendCode';
	var url = el.attr('data-url');
	var countdown = ST.sendCodeCountdown;
	var suffix = "秒后重新发送"
	var mobile = $('input[name='+ST.mobileInput+']').val();

	if (!mobile) {
		showTip("请填写手机号码", 'error');
		return false;
	}
	if (!mobile.match(/^1\d{10}$/)) {
		showTip("请填写正确的手机号码", 'error');
		return false;
	}

	if (ST[STKey] == false) {
		return false;
	}
	ST[STKey] = false;

	$.get(url, {
		'mobile' : mobile
	}, function(info) {
		var type = info.status ? 'success' : 'error';
		showTip(info.msg, type);
	}, 'json');

	elText = el.text();
	el.text('' + countdown + suffix);
	timer = function() {

		time = parseInt(el.text()) - 1;
		if (time == 0) {
			el.text(elText);
			clearInterval(timerId);
			ST[STKey] = true;
		} else {
			el.text('' + time + suffix)
		}
	};
	timerId = setInterval(timer, '1000');

	return false;
};

/**
 * 注册表单验证规则
 */
var regiterFormValidator = {
	'onfocusout' : false,
	'onkeyup' : false,
	'onclick' : false,
	'rules' : {
		'mobile' : {
			'required' : true,
			'isPhone' : true,
			'remote' : '/wx/index/check_mobile.html'
		},
		'password' : {
			'required' : true,
			'rangelength' : [6, 16]
		},
		'password_confirm' : {
			'required' : true,
			'equalTo' : '#password'
		},
		'certno' : {
			'required' : true,
			'isCardno' : true
		},
		'code' : {
			'required' : true,
			"number" : true,
			"rangelength" : [6, 6]
		}
	},
	'messages' : {
		'mobile' : {
			'required' : "请填写手机号码",
			'isPhone' : "请填写正确的的手机号码",
			'remote' : '手机号码已注册'
		},
		'password' : {
			'required' : "请填写密码",
			'rangelength' : "密码应在 6 - 16 位之间"
		},
		'password_confirm' : {
			'required' : "请重复密码",
			'equalTo' : "两次输入密码不同"
		},
		'certno' : {
			'required' : "请填写证件号码",
			'isCardno' : "请填写正确的的证件号码"
		},
		'code' : {
			'required' : "请输入验证码",
			"number" : "验证码为6位数字",
			"rangelength" : "验证码为6位数字"
		}
	},
	'submitHandler' : function(form) {
		var formEl, buttonEl, buttonText, codeCheck;

		if (ST.registerFormSendding) {
			return false;
		}
		ST.registerFormSendding = true;

		$.ajax({
			'url' : '/wx/index/check_code.html',
			'data' : $(form).serialize(),
			'dataType' : 'json',
			'async' : false,
			'success' : function(info) {
				codeCheck = info.status;
			}
		});

		if (!codeCheck) {
			showTip("验证码错误", 'error');
			ST.registerFormSendding = false;
			return false;
		}

		if (!ST.registerClause) {
			openDialog();
			ST.registerFormSendding = false;
			return false;
		}

		formEl = $(form);
		buttonEl = formEl.find('#j_submit');
		buttonText = buttonEl.text();
		buttonEl.text('注册中...');

		$.ajax({
			'url' : formEl.attr('action'),
			'data' : $(form).serialize(),
			'dataType' : 'json',
			'success' : function(info) {
				if (info.status) {
					buttonEl.text('注册成功！');
					showTip(info.msg, 'success');
					setTimeout(function() {
						window.location.href = info.url;
					}, 2000);
				} else {
					ST.registerFormSendding = false;
					buttonEl.text(buttonText);
					showTip(info.msg, 'error');
				}
			}
		});
		return false;
	},
	'errorPlacement' : function(error, element) {
		showTip(error.text(), 'error');
	}
};

/**
 * 绑定表单验证规则
 */
var bindFormValidator = {
	'onfocusout' : false,
	'onkeyup' : false,
	'onclick' : false,
	'rules' : {
		'mobile' : {
			'required' : true,
			'isPhone' : true
		},
		'password' : {
			'required' : true
		}
	},
	'messages' : {
		'mobile' : {
			'required' : "请填写手机号码",
			'isPhone' : "请填写正确的的手机号码"
		},
		'password' : {
			'required' : "请填写密码"
		}
	},
	'submitHandler' : function(form) {
		var formEl, buttonEl, buttonText;

		if (ST.registerFormSendding) {
			return false;
		}
		ST.registerFormSendding = true;

		formEl = $(form);
		buttonEl = formEl.find('#j_submit');
		buttonText = buttonEl.text();
		buttonEl.text('登录中...');

		$.ajax({
			'url' : formEl.attr('action'),
			'data' : $(form).serialize(),
			'dataType' : 'json',
			'success' : function(info) {
				if (info.status) {
					buttonEl.text('登录成功！');
					showTip(info.msg, 'success');
					setTimeout(function() {
						window.location.href = info.url;
					}, 2000);
				} else {
					ST.registerFormSendding = false;
					buttonEl.text(buttonText);
					showTip(info.msg, 'error');
				}
			}
		});
		return false;
	},
	'errorPlacement' : function(error, element) {
		showTip(error.text(), 'error');
	}
};

// 预约页面初始化
var ordersSetSize = function(els) {
	var padding = ($("li.j_step").css("padding").split("px"))[0];
	var size = ST.windowWidth - padding * 2;
	els.width(size);
};

// 预约切换下一步
var ordersGoNext = function() {
	var leftpx = ($(this).parents("ul.content").css("margin-left"))
	$(this).parents("ul.content").animate({
		marginLeft : (parseFloat(leftpx.split("px")[0]) - ST.windowWidth) + "px"
	});
};

// 预约切换上一步
var ordersGoPrev = function() {
	var leftpx = ($(this).parents("ul.content").css("margin-left"))

	$(this).parents("ul.content").animate({
		marginLeft : (parseFloat(leftpx.split("px")[0]) + ST.windowWidth) + "px"
	})

};

// 订单列表页加载更多
var loadMore = function() {
	var el, url, elText;

	if (ST.loadingMore) {
		return false;
	}
	ST.loadingMore = true;

	el = $(this);
	url = el.attr('data-url');
	elText = el.text();

	el.text('加载中...');
	$.post(url, {
		'page' : ST.page
	}, function(info) {
		ST.loadingMore = false;
		ST.page++;
		if (info.msg.load_more) {
			el.text(elText);
		} else {
			el.hide();
		}
		ST.container.append(info.msg.html);
	}, 'json');
};

// 解除绑定
var unbindUser = function() {
	var el, url, elText;

	if (ST.unbinding) {
		return false;
	}
	ST.unbinding = true;

	el = $(this);
	url = el.attr('data-url');
	elText = el.text();

	el.text('请稍候...');
	$.get(url, {}, function(info) {
		ST.unbinding = false;
		showTip(info.msg);
		el.text(elText);
		setTimeout(function() {
			window.location.href = info.url;
		}, 2000);
	}, 'json');
}
// *******************************************************
// ************************ 初始化 ************************
// *******************************************************

// 取得屏幕宽度
ST.windowWidth = $(window).innerWidth();

$(function() {

	// 提示框元素, 点击隐藏
	ST.tipEl = $('#j_tip');
	$('body').delegate('#j_tip', 'click', function() {
		clearTimeout(ST.tipTimerId);
		$(this).fadeOut();
	});

	// 列表数据容器
	ST.container = $('.end_booking');
});
