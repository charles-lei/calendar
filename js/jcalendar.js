function Gid(objectId) {
	if (document.getElementById && document.getElementById(objectId)) {
		// W3C DOM
		return document.getElementById(objectId);
	} else if (document.all && document.all(objectId)) {
		// MSIE 4 DOM
		return document.all(objectId);
	} else if (document.layers && document.layers[objectId]) {
		// NN 4 DOM.. note: this won't find nested layers
		return document.layers[objectId];
	} else {
		return false;
	}
}
var current_date = shopEvents.date.split("-");
var current_year = current_date[0],
	current_month = getFull(current_date[1]),
	current_day = getFull(current_date[2]);
	
function getFull(value){
	return value.length == 1 ? "0" + value : value;
}
	
function calendar(year, month, date){
	
}

function JCalendar() {
	//实例变量
	this.year = current_year;
	this.month = current_month;
	this.date = current_day;

	this.fday = new Date(this.year, this.month - 1, 1).getDay(); //每月第一天的前一天星期数
	this.dayNum = new Date(this.year, this.month, 0).getDate(); //每月的天数
	//成员变量，当前年月日
	JCalendar.cur_year = current_year;
	JCalendar.cur_month = current_month;
	JCalendar.cur_date = current_day;
}
JCalendar.prototype.show = function() {
	//日历里的每个单元格的数据，预先定义一段空数组，对应日历里第一周空的位置。[注意星期天对应的数是0]
	var date = new Array(this.fday > 0 ? this.fday : 0);
	var html_str = new Array(); //保存日历控件的HTML代码

	var weekDay = ["M", "T", "W", "T", "F"];
	for (var j = 1; j <= this.dayNum; j++) { //初始化date数组
		date.push(j);
	}
	html_str.push("<table id='calendar' cellspacing='0' cellpadding='0' width='100%'>");
	html_str.push("<th colspan='7'><p title='Pre' onclick=\"JCalendar.update(-1);return false\" style='float:left; margin-left:10px; margin-top:2px' class='prev'><img src='img/left_arrow.png' width='15' height='15' /></p><p title='Next Month' onclick=\"JCalendar.update(1);return false\" style='float:right;margin-right:10px;margin-top:2px;' class='next'><img src='img/right_arrow.png' width='15' height='15' /></p><p id='calendar_title' style='color:#c0c0c0;font-weight:normal;font-size:16px;'>" + this.year + "年" + getFull(this.month) + "月</p></th>");
	html_str.push("<tr>");
	html_str.push("<td>S</td>");
	for (var i = 0; i < 5; i++) { //填充日历头
		html_str.push("<td>" + weekDay[i] + "</td>");
	}
	html_str.push("<td>S</td>");
	html_str.push("</tr>");
	//日历主体
	var tmp;
	for (var i = 0; i < 6; i++) { //填充日期，6行7列
		html_str.push("<tr>");
		for (var j = 0; j < 7; j++) {
			tmp = date[7*i+j];
			tmp = tmp ? tmp : "";
			if (tmp == this.date) {
				html_str.push("<td><div id='c_today' class='c_today'>" + JCalendar.cur_date + "</div></td>");
			}else if (tmp == "") {
				html_str.push("<td></td>");
			}else {
				html_str.push("<td><div>" + tmp + "</div></td>");
			}
			//console.log(tmp,date)
		}
		html_str.push("</tr>");
	}

	html_str.push("</table>");
	return html_str.join("");
}

function rili_init() {
	document.getElementById("calendar_container").innerHTML = new JCalendar().show(); /*  |xGv00|106707c554d687c1a77addb2ae941bcc */
	var json = shopEvents;
	for(var i = 0; i < json.monthEvents.length; i++) {
		if(current_month == json.monthEvents[i].month) {
			for(var j = 0; j < json.monthEvents[i].events.length; j++) {
				//活动添加class
				jQuery("#calendar tr td div").each(function() {
					var th = jQuery(this).html();
					th = th.length == 1 ? "0" + th : th;
					if(th == json.monthEvents[i].events[j].date) {
						jQuery(this).addClass("has");
						jQuery(this).attr('onmouseover', 'JCalendar.click(this)');
					}
					if(new Date(json.showdate).getDate() == th) {
						jQuery(this).addClass("current");
					}
				});
			}
		}
	}
	//静态方法
	JCalendar.update = function(_month) {
		var date = new Date(JCalendar.cur_year, JCalendar.cur_month - 1 + _month, 1);
		var fday = date.getDay(); //每月第一天的星期数
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dayNum = new Date(JCalendar.cur_year, parseInt(JCalendar.cur_month) + _month, 0).getDate(); //每月的天数
		var tds = document.getElementById("calendar").getElementsByTagName("td");
		for(var i = 7; i < tds.length; i++) //清空日历内容
			tds[i].innerHTML = "";
		document.getElementById("calendar_title").innerHTML = year + "年" + (month < 10 ? ('0' + month) : month) + "月"; //更新显示年月
		//更新当前年月
		JCalendar.cur_year = year;
		JCalendar.cur_month = month;

		for(var j = 1; j <= dayNum; j++) {
			if(j == current_day && year == current_year && month == current_month) {
				tds[6 + fday + j].innerHTML = "<div class='c_today'>" + j + "</div>";
			} else {
				tds[6 + fday + j].innerHTML = "<div>" + j + "</div>";
			}
		}

		//获取日期数据状态
		for(var i = 0; i < json.monthEvents.length; i++) {
			if(JCalendar.cur_month == json.monthEvents[i].month) {
				for(var k = 0; k < json.monthEvents[i].events.length; k++) {
					jQuery("#calendar tr td div").each(function() {
						//console.log()
						var th = jQuery(this).html();
						th = th.length == 1 ? "0" + th : th;
						if(th == parseInt(json.monthEvents[i].events[k].date)) {
							jQuery(this).addClass("has");
							jQuery(this).attr('onmouseover', 'JCalendar.click(this)');
						}
					});
					if(json.monthEvents[i].events[k].date == JCalendar.cur_date) {
						jQuery("#calendar tr td div").each(function() {
							if(jQuery(this).html() == parseInt(JCalendar.cur_date)) {
								jQuery(this).addClass("current");
							}
						});
					}
				}
			}
		}
		JCalendar.onupdate(year, month, JCalendar.cur_date);
	}
	JCalendar.onupdate = function(year, month, date) { //日历更改时执行的函数，可以更改为自己需要函数,控件传递过来的参数为当前日期
		//alert(year + "年" + month + "月" + date + "日");
	}

	JCalendar.click = function(obj) {
		var tmp = document.getElementById("c_today");
		if(jQuery(obj).hasClass("has")) {
			jQuery("#calendar div").removeClass("current");
			jQuery(obj).addClass("current");
			JCalendar.onclick(JCalendar.cur_year, JCalendar.cur_month, obj.innerHTML);
		}
	}
	JCalendar.onclick = function(year, month, date) {

		month = getFull(month);
		date = getFull(date);

		var html = '';
		for(var j = 0; j < json.monthEvents.length; j++) {
			if(month == json.monthEvents[j].month) {
				var subHtml = '',
					tempDate;
				for(var k = 0; k < json.monthEvents[j].events.length; k++) {
					if(date == json.monthEvents[j].events[k].date) {
						tempDate = json.monthEvents[j].events[k].date;
						var txtCount = json.monthEvents[j].events[k].info;
						txtCount = txtCount.length > 59 ? txtCount.substring(0, 59) : txtCount;
						subHtml += '<div class="dashiji_box">' +
							'<a href="#carousel-679483" class="left  carousel-control">‹</a>' +
							'<a href="#carousel-679483" class="right carousel-control">›</a>' +
							'<img src="' + json.monthEvents[j].events[k].imgurl + '"width="100%" height="288" alt="" />' +
							'<div class="info_title">' + json.monthEvents[j].events[k].title + '</div>' +
							'<div class="info">' + txtCount + '....<a href="' + json.monthEvents[j].events[k].url + '">【点击领取小礼品】</a></p>' +
							'</div>';
					}
				}
				html += subHtml;
			}
		}
		jQuery("#rili_info").html(html);

		JCalendar.cur_year = year;
		JCalendar.cur_month = month;
		JCalendar.cur_date = date;
	}

	//初始化未来最近的显示数据
	var showdate = json.showdate.split("-");
	JCalendar.onclick(showdate[0], showdate[1], showdate[2]);
}
rili_init();

