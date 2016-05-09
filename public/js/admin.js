/*
 * @Author: Yuk
 * @Date:   2016-04-21 17:33:20
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-26 22:29:17
 */

'use strict';
// 删除
$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		$.ajax({
				type: 'DELETE',
				url: '/admin/movie/list?id=' + id
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
