ihr = {
	top: null,
	bottom: null,
	init: function() {
		ihr.top = $('<li title="Развернуть верхний" class="ihr_open ihr_open_top">↑</li>');
		ihr.bottom = $('<li title="Развернуть нижний" class="ihr_open ihr_open_bottom">↓</li>');
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
			'count': $('#comments .mark span').length
		});
	},
	update: function(val_min, val_max) {
		$('.ufo-was-here,.ihr_open').unbind('hover').remove();
		$('#comments .comment_holder').each(function() {
			var h = $(this);
			var n = h.find('.mark:first span');
			if (n.length) {
				n = ihr.get_number(n.html());
				if (n < val_min || n > val_max) {
					h.find('>.msg-meta,>.entry-content,>.reply_form').addClass('ihr_hide');
				}
				else {
					h.find('>.msg-meta,>.entry-content,>.reply_form').removeClass('ihr_hide');
				}
			}
		}).find('>.msg-meta').hover(ihr.hover_on, ihr.hover_off);
		chrome.extension.sendRequest({
			'type': 'update',
			'valid': $('#comments').length,
			'count': $('#comments .entry-content:visible').length
		});
	},
	hover_on: function() {
		var th = $(this);
		th.find('.down-to-child:first').after(ihr.top).after(ihr.bottom);
		
		var t = th.parent('li').parents('.comment_holder:first').find('>.entry-content');
		if (t.hasClass('ihr_hide')) ihr.top.removeClass('ihr_hide').data('a', t).click(ihr.top_click);
		else ihr.top.addClass('ihr_hide');
		
		var b = th.parent('li').find('.comment_holder:first').find('>.entry-content');
		if (b.hasClass('ihr_hide')) ihr.bottom.removeClass('ihr_hide').data('a', b).click(ihr.bottom_click);
		else ihr.bottom.addClass('ihr_hide');
	},
	top_click: function() {
		var tt = $(this).data('a').parent();
		tt.find('>.msg-meta,>.entry-content,>.reply_form').removeClass('ihr_hide');
		$(this).unbind('hover').remove();
	},
	bottom_click: function() {
		var tt = $(this).data('a').parent();
		tt.find('>.msg-meta,>.entry-content,>.reply_form').removeClass('ihr_hide');
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
