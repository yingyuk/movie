/*
* @Author: Yuk
* @Date:   2016-05-09 14:51:16
* @Last Modified by:   Yuk
* @Last Modified time: 2016-05-09 14:51:39
*/

'use strict';
$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		$.ajax({
				type: 'DELETE',
				url: '/admin/user/list?id=' + id
			})
			.done(function(results) {
				if (results.success === 1) {
					if (tr.length > 0) {
						tr.remove()
					}
				}
			})
	})
})
