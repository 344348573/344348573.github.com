		// 	options = $.extend({
		// 	//navigation
		// 	'menu': false,
		// 	'anchors':[],
		// 	'navigation': false,
		// 	'navigationPosition': 'right',
		// 	'navigationColor': '#000',
		// 	'navigationTooltips': [],
		// 	'slidesNavigation': false,
		// 	'slidesNavPosition': 'bottom',
		// 	'scrollBar': false,
		//  'timeoutScroll':true,
		// 	//scrolling
		// 	'css3': true,
		// 	'scrollingSpeed': 700,
		// 	'autoScrolling': true,
		// 	'easing': 'easeInQuart',
		// 	'easingcss3': 'ease',
		// 	'loopBottom': false,
		// 	'loopTop': false,
		// 	'loopHorizontal': true,
		// 	'continuousVertical': false,
		// 	'normalScrollElements': null,
		// 	'scrollOverflow': false,
		// 	'touchSensitivity': 5,
		// 	'normalScrollElementTouchThreshold': 5,

		// 	//Accessibility
		// 	'keyboardScrolling': true,
		// 	'animateAnchor': true,

		// 	//design
		// 	'controlArrows': true,
		// 	'controlArrowColor': '#fff',
		// 	"verticalCentered": true,
		// 	'resize': true,
		// 	'sectionsColor' : [],
		// 	'paddingTop': 0,
		// 	'paddingBottom': 0,
		// 	'fixedElements': null,
		// 	'responsive': 0,

		// 	//Custom selectors
		// 	'sectionSelector': '.section',
		// 	'slideSelector': '.slide',


		// 	//events
		// 	'afterLoad': null,
		// 	'onLeave': null,
		// 	'afterRender': null,
		// 	'afterResize': null,
		// 	'afterReBuild': null,
		// 	'afterSlideLoad': null,
		// 	'onSlideLeave': null
		// }, options);



		(function($) {

			var defaultConfig = {

				"fullpageConfig": {}, //继承fullpage 原生参数

				//基础属性
				"pageId": "", //卡片序列号,必填

				"pageKeyWord": "", //卡片关键词,非必填

				"pageType": 1, //暂定两种,必填 1为贺卡类型所有字段固定,样式固定,格式固定; 0为自定义; //其他扩充类型 自增

				"cardInfo": {
					"cardName": "", //名称
					"cardTitle": "", //标题
					"cardFrom": "", //寄件人
					"cardTo": "", //收件人
					"cardDate": "", //寄件日期
					"cardImgs":[]
				}, //type为 1时 专用,均为必填

				//特殊属性

				// "pageInfo": {
				// 	"signer": "cssid", //标示元素的属性名称

				// 	"pageSectionsCont": [

				// 	]

				// }, ////type为 2时 专用 pageSectionsCont 和 pageSectionsAni 个数必须一致
				loading: function() {
					// if ($(".CardPageLoadingPage").size() < 1) {

					// 	$("body").append($("<div class='CardPageLoadingPage' style='position:fixed; width:100%;height:100%;'></div>"))
					// }

				}, //载入时回调
				finish: function() {
						$(".CardPageLoadingPage").hide()
					} //载入完成时回调
			};


			var CardPage = function(el, conf) {

				this.el = el;
				this.config = $.extend({}, defaultConfig, conf)
				this.info = {};
				// 启动


				this.init();
			}

			CardPage.prototype = {

				"init": function() {

					if (typeof(this.config.loading) == "function") {
						this.config.loading();
					}
					if(this.config.pageType==1){
						this.initCard();
					}
					this.paging();
					if (typeof(this.config.finish) == "function") {
						this.config.finish();
					}

				},
				"initCard":function(){
					var imgs=this.config.cardInfo.cardImgs;
					var els=$(this.el);
					if(imgs.length!=0 && this.config.pageType==1){
						
						for(var i=0;i<imgs.length;i++){
							els.append($('<section class="section" id="section'+i+'"></section>').css({
								"background":"url("+imgs[i]+")  center center no-repeat",
								"background-size":"cover"
								//"background-attachment":"fixed"
							}));
						}
					}

				},
				"paging": function() {
					//自定义fullpage
					
					var context = this;
					var conff = this.config.fullpageConfig;
					conff.afterLoad = function(anchor, index) {
						context.onfinishload(anchor, index);

					};
					conff.onLeave = function(fromindex, toindex, direction) {
						context.onleave(fromindex, toindex, direction);
					}
					conff.afterResize=function(){
						if(conff.scrollOverflow)context.el.children().css("overflow", "hidden");
					}
					conff.afterRender = function() {

						if(context.config.pageInfo){
							console.log(context.config.pageInfo)
							for (var i = 1; i <= context.config.pageInfo.elements.length; i++) {
								context.setCss(i, context.config.pageInfo);
							}
							
							var href = location.href.split("#");
							if (href.length > 0) {
								href = href[1];
							}

							var ins = (href === undefined) ? 1 : context.config.fullpageConfig.anchors.indexOf(href) + 1;

							var aa = function() {
								context.setEndCss(ins, context.config.pageInfo)
								if (context.config.pageInfo.scale) {

									var speed = context.config.fullpageConfig.scrollingSpeed;
									context.el.children().css("overflow", "hidden");
									context.el.children().find('.container').css({
										"-webkit-transition": "all " + speed / 1000 + "s",
										"-moz-transition": "all " + speed / 1000 + "s",
										"-o-transition": "all " + speed / 1000 + "s",
										"-webkit-transform": "translateY(-300px)",
										"-moz-transform": "translateY(-300px)",
										"-o-transform": "translateY(-300px)"
									});

									context.el.children().eq(ins-1).find('.container').css({
										"-webkit-transition": "all " + speed / 1000 + "s",
										"-moz-transition": "all " + speed / 1000 + "s",
										"-o-transition": "all " + speed / 1000 + "s",
										"-webkit-transform": "translateY(0px)",
										"-moz-transform": "translateY(0px)",
										"-o-transform": "translateY(0px)"
									});
								}
							}

						}
						setTimeout(aa, 100);

					}
					
					this.el.fullpage(conff)
				},
				//初始css
				"setCss": function(index, opt) {
					var signerName = opt.signerName;
					var elements = opt.elements;
					for (var x in elements) {

						if (elements[x]['sectionIndex'] == index - 1) {
							var a = this.el.children().eq(index - 1).find("[" + signerName + "=\'" + elements[x]['signerId'] + "\']");
							var cssConf = {
								// 'position':'absolute',
								'margin-left': elements[x]['animate']['from']['position'][0],
								'margin-top': elements[x]['animate']['from']['position'][1],
								'width': elements[x]['animate']['from']['size'][0],
								'height': elements[x]['animate']['from']['size'][1],
								'-webkit-transition': elements[x]['aniOpts'] + " 0s  0s",
								'-moz-transition': elements[x]['aniOpts'] + " 0s  0s",
								'-o-transition': elements[x]['aniOpts'] + " 0s  0s",

								// '-webkit-transition': elements[x]['aniOpts'] + " " + parseInt(elements[x]['interval']) / 1000 + 's' + " " + parseInt(elements[x]['delay']) / 1000 + 's',
								'border': elements[x]['animate']['from']['border']['borderWidth'] + " solid " + elements[x]['animate']['from']['border']['borderColor'],
								'border-radius': elements[x]['animate']['from']['border']['borderRadius'],
								'-moz-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'-o-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'-webkit-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'background-color': elements[x]['animate']['from']['bgColor'],
								'opacity': elements[x]['animate']['from']['opacity'],
								'transform-origin': elements[x]['circlePoint'][0] + " " + elements[x]['circlePoint'][1]
							}
							if (elements[x]['animate']['from']['position'][0] == 'center' || elements[x]['animate']['from']['position'][0] == "") {
								cssConf.left = "0";
								cssConf.right = "0";
								cssConf.marginLeft = "auto";
								cssConf.marginRight = "auto";
							}
							if (elements[x]['animate']['from']['position'][1] == 'center' || elements[x]['animate']['from']['position'][1] == "") {
								cssConf.top = "";
							}
							a.css(cssConf);

							if (typeof(elements[x].callback) == 'function') {
								var signId = elements[x]['signerId'];
								elements[x].callback(index, signId);
							}
						}

					}

					//结束css
				},
				"setEndCss": function(index, opt) {

					var signerName = opt.signerName;
					var elements = opt.elements;
					if(elements.length==0)return;
					for (var x in elements) {

						if (elements[x]['sectionIndex'] == index - 1) {
							var a = this.el.children().eq(index - 1).find("[" + signerName + "=\'" + elements[x]['signerId'] + "\']");
							var cssConf = {
								// 'position':'absolute',
								'margin-left': elements[x]['animate']['to']['position'][0],
								'margin-top': elements[x]['animate']['to']['position'][1],
								'width': elements[x]['animate']['to']['size'][0],
								'height': elements[x]['animate']['to']['size'][1],
								'-webkit-transition': elements[x]['aniOpts'] + " " + parseInt(elements[x]['interval']) / 1000 + 's' + " " + elements[x]['aniFun'] + " " + parseInt(elements[x]['delay']) / 1000 + 's',
								'-moz-transition': elements[x]['aniOpts'] + " " + parseInt(elements[x]['interval']) / 1000 + 's' + " " + elements[x]['aniFun'] + " " + parseInt(elements[x]['delay']) / 1000 + 's',
								'-o-transition': elements[x]['aniOpts'] + " " + parseInt(elements[x]['interval']) / 1000 + 's' + " " + elements[x]['aniFun'] + " " + parseInt(elements[x]['delay']) / 1000 + 's',
								'border': elements[x]['animate']['to']['border']['borderWidth'] + " solid " + elements[x]['animate']['to']['border']['borderColor'],
								'border-radius': elements[x]['animate']['to']['border']['borderRadius'],
								'-webkit-transform': 'rotate(' + elements[x]['animate']['to']['rotate'] + ") scale(" + elements[x]['animate']['to']['scale'] + ")",
								'-moz-transform': 'rotate(' + elements[x]['animate']['to']['rotate'] + ") scale(" + elements[x]['animate']['to']['scale'] + ")",
								'-o-transform': 'rotate(' + elements[x]['animate']['to']['rotate'] + ") scale(" + elements[x]['animate']['to']['scale'] + ")",
								'background-color': elements[x]['animate']['to']['bgColor'],
								'opacity': elements[x]['animate']['to']['opacity'],
								'transform-origin': elements[x]['circlePoint'][0] + " " + elements[x]['circlePoint'][1]
							}
							if (elements[x]['animate']['to']['position'][0] == 'center' || elements[x]['animate']['to']['position'][0] == "") {
								cssConf.left = "0";
								cssConf.right = "0";
								cssConf.marginLeft = "auto";
								cssConf.marginRight = "auto";

							}
							if (elements[x]['animate']['to']['position'][1] == 'center' || elements[x]['animate']['to']['position'][1] == "") {
								cssConf.top = "";
							}
							a.css(cssConf);



						}

					}
					if (typeof(elements[x]['callBack']) == 'function') {
						var signId = elements[x]['signerId'];

						var cbf = elements[x]['callBack'](index, signId);

						setTimeout(cbf, parseInt(elements[x]['delay']))

					}



				},

				"removeEndCss": function(index, opt) {

					var signerName = opt.signerName;
					var elements = opt.elements;
					for (var x in elements) {

						if (elements[x]['sectionIndex'] == index - 1) {
							var a = this.el.children().eq(index - 1).find("[" + signerName + "=\'" + elements[x]['signerId'] + "\']");
							var cssConf = {
								// 'position':'absolute',
								'margin-left': elements[x]['animate']['from']['position'][0],
								'margin-top': elements[x]['animate']['from']['position'][1],
								'width': elements[x]['animate']['from']['size'][0],
								'height': elements[x]['animate']['from']['size'][1],
								// '-webkit-transition': elements[x]['aniOpts'] + " " + parseInt(elements[x]['interval']) / 1000 + 's' + " " + parseInt(elements[x]['delay']) / 1000 + 's',
								'-webkit-transition': 'all 1s 0s',
								'-moz-transition': 'all 1s 0s',
								'-o-transition': 'all 1s 0s',
								'border': elements[x]['animate']['from']['border']['borderWidth'] + " solid " + elements[x]['animate']['from']['border']['borderColor'],
								'border-radius': elements[x]['animate']['from']['border']['borderRadius'],
								'-webkit-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'-moz-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'-webkit-transform': 'rotate(' + elements[x]['animate']['from']['rotate'] + ") scale(" + elements[x]['animate']['from']['scale'] + ")",
								'background-color': elements[x]['animate']['from']['bgColor'],
								'opacity': elements[x]['animate']['from']['opacity'],
								'transform-origin': elements[x]['circlePoint'][0] + " " + elements[x]['circlePoint'][1]

							}
							if (elements[x]['animate']['from']['position'][0] == 'center' || elements[x]['animate']['from']['position'][0] == "") {
								cssConf.left = "0";
								cssConf.right = "0";
								cssConf.marginLeft = "auto";
								cssConf.marginRight = "auto";
							}
							if (elements[x]['animate']['from']['position'][1] == 'center' || elements[x]['animate']['from']['position'][1] == "") {
								cssConf.top = "";
							}
							a.css(cssConf);

							if (typeof(elements[x]['callback']) == 'function') {
								var signId = elements[x]['signerId'];
								elements[x]['callback'](index, signId);
							}
						}

					}

				},



				"onleave": function(fromindex, toindex, direction) {
					var pageInfo = this.config.pageInfo;
					if(pageInfo){
						this.removeEndCss(fromindex, pageInfo);
						if (this.config.pageInfo.scale) {
							var speed = this.config.fullpageConfig.scrollingSpeed;
							this.el.children().css("overflow", "hidden");
							this.el.children().eq(fromindex - 1).find('.container').css({
								"-webkit-transition": "all " + speed / 1000 + "s",
								"-moz-transition": "all " + speed / 1000 + "s",
								"-o-transition": "all " + speed / 1000 + "s",
								"-webkit-transform": "translateY(-300px)",
								"-moz-transform": "translateY(-300px)",
								"-o-transform": "translateY(-300px)"
							});
							this.el.children().eq(toindex - 1).find('.container').css({
								"-webkit-transition": "all " + speed / 1000 + "s",
								"-moz-transition": "all " + speed / 1000 + "s",
								"-o-transition": "all " + speed / 1000 + "s",
								"-webkit-transform": "translateY(0px)",
								"-moz-transform": "translateY(0px)",
								"-o-transform": "translateY(0px)"

							})
						}
					}
				},
				"onfinishload": function(anchor, index) {
					var pageInfo = this.config.pageInfo;
					if(pageInfo){
						this.setCss(index, pageInfo);
						this.setEndCss(index, pageInfo);
					}
				}



			}

			$.fn.extend({
				'CardPage': function(config) {
					config = config || {};
					// this.each(function() {
					new CardPage($(this), config);
					//});
				}
			});
		})(jQuery);