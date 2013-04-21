ihr = {
	top: null,
	bottom: null,
	init: function() {
		ihr.top = $('<div title="Развернуть верхний" class="ihr_open ihr_open_top">↑</div>');
		ihr.bottom = $('<div title="Развернуть нижний" class="ihr_open ihr_open_bottom">↓</div>');
	},
	info: function() {
		var val_min = 1000;
		var val_max = -1000;
		$('#comments .mark span').each(function() {
			var n = ihr.get_number($(this).html());
			if (n < val_min) val_min = n;
			if (n > val_max) val_max = n;
		});
		chrome.extension.sendRequest({
			'type': 'load',
			'url': window.location.href,
			'val_min': val_min,
			'val_max': val_max,
			'valid': $('#comments').length,
			'count': $('#comments .voting span').length
		});
	},
	update: function(val_min, val_max) {
		$('.ufo-was-here,.ihr_open').unbind('hover').remove();
		$('#comments .comment_item').each(function() {
			var h = $(this);
			var n = h.find('.mark:first span');
			if (n.length) {
				n = ihr.get_number(n.html());
				if (n < val_min || n > val_max) {
					h.find('.comment_body').addClass('ihr_hide');
				}
				else {
					h.find('.comment_body').removeClass('ihr_hide');
				}
			}
		}).find('.comment_body .info').hover(ihr.hover_on, ihr.hover_off);
		chrome.extension.sendRequest({
			'type': 'update',
			'valid': $('#comments').length,
			'count': $('#comments .message:visible').length
		});
	},
	hover_on: function() {
		var th = $(this);
		th.append(ihr.top).append(ihr.bottom);

		var t = th.parents('.reply_comments:first').prevAll('.message');
		if (t.hasClass('ihr_hide')) ihr.top.removeClass('ihr_hide').data('a', t).click(ihr.top_click);
		else ihr.top.addClass('ihr_hide');

		var b = th.parent('.comment_item').find('.comment_body .message');
		if (b.hasClass('ihr_hide')) ihr.bottom.removeClass('ihr_hide').data('a', b).click(ihr.bottom_click);
		else ihr.bottom.addClass('ihr_hide');
	},
	top_click: function() {
		var tt = $(this).data('a').parent();
		tt.find('.comment_body').removeClass('ihr_hide');
		$(this).unbind('hover').remove();
	},
	bottom_click: function() {
		var tt = $(this).data('a').parent();
		tt.find('.comment_body').removeClass('ihr_hide');
		$(this).unbind('hover').remove();
	},
	hover_off: function() {
		$(this).find('.ihr_open').remove();
	},
	get_number: function(html) {
		if (html.indexOf('+') == -1 && html != '0') html = '-' + html.slice(1);
		return Number(html);
	}
};

$(ihr.init);
