$(document).ready(function () {
	$('#allint').click(function () {
		var checkboxes = document.getElementsByTagName('input');
		if (this.checked) {
			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type == 'checkbox') {
					checkboxes[i].checked = true;
				}
			}
		} else {
			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type == 'checkbox') {
					checkboxes[i].checked = false;
				}
			}
		}
	});

	function addSelectChange() {
		$("input[type='checkbox'].int").bind('change', function () {
			updateAllInt();
		});
		updateAllInt();
	}

	function updateAllInt() {
		if (
			$("input[type='checkbox'].int:checked").length ==
			$("input[type='checkbox'].int").length
		) {
			$('#allint').prop('checked', true);
		} else {
			$('#allint').prop('checked', false);
		}
	}

	$('#addcol').click(function () {
		var $tablerow = $('#model').find('tr');
		count = 0;

		var rows = $('#model').find('tr').length;

		$tablerow.each(function (index, value) {
			count += 1;

			var $listitem = $(this);
			n = parseInt($listitem.index());

			var $newRow = $(
				'<td style="min-width:60px"><input type="tel" class="form-control input-sm" value="0"></td>'
			);

			if (n == 1) {
				var $newRow = $(
					'<td><input onchange="addSelectChange()" type="checkbox" class="int"></td>'
				);
			} else if (n == rows - 1) {
				var $newRow = $(
					'<td><button type="button" class="btn btn-default remvar">-</button></td>'
				);
			}
			$('#model tr:eq(' + n + ') td:eq(-2)').before($newRow);
		});

		updateRemVarButton();
		updateAllInt();
	});

	$('#remcol').click(function () {
		var $tablerow = $('#model').find('tr');

		var columns = $('#model tr:eq(0) td').length;

		if (columns > 4) {
			$tablerow.each(function (row, value) {
				$('#model tr:eq(' + row + ') td:eq(-3)').remove();
			});
		}

		updateRemVarButton();
		updateAllInt();
	});

	$('#model').on('click', '.remvar', function () {
		var $tablerow = $('#model').find('tr');

		var columns = $('#model tr:eq(0) td').length;

		column = $(this).parent().index();

		if (columns > 4) {
			$tablerow.each(function (row, value) {
				$('#model tr:eq(' + row + ') td:eq(' + column + ')').remove();
			});
		}

		updateRemVarButton();
		updateAllInt();
	});

	function updateRemVarButton() {
		var columns = $('#model tr:eq(0) td').length;

		if (columns < 5) {
			$('#remcol').prop('disabled', true);
			$('.remvar').prop('disabled', true);
		} else {
			$('#remcol').prop('disabled', false);
			$('.remvar').prop('disabled', false);
		}
	}

	$('#addrow').click(function () {
		$('#model tr:eq(-1)').before('<tr></tr>');

		var columns = $('#model tr:eq(0) td').length;

		$('#model tr:eq(0) td').each(function (index, value) {
			if (index == 0) {
				$('#model tr:eq(-2)').append(
					'<td><button type="button" class="btn btn-default remcon">-</button></td>'
				);
			} else if (index == columns - 2) {
				$('#model tr:eq(-2)').append(
					'<td style="min-width:70px"><select class="form-control input-sm"><option value="0">&#8804;</option><option value="1">&#8805;</option><option value="2">=</option></select></td>'
				);
			} else {
				$('#model tr:eq(-2)').append(
					'<td style="min-width:60px"><input type="tel" class="form-control input-sm" value="0"></td>'
				);
			}
		});

		updateRemConButton();
	});

	$('#remrow').click(function () {
		var rows = $('#model').find('tr').length;

		if (rows > 4) {
			$('#model tr:eq(-2)').remove();
			rows = rows - 1;
		}

		updateRemConButton();
	});

	$('#model').on('click', '.remcon', function () {
		var rows = $('#model').find('tr').length;

		if (rows > 4) {
			$(this).parent().parent().remove();
			rows = rows - 1;
		}

		updateRemConButton();
	});

	function updateRemConButton() {
		var rows = $('#model').find('tr').length;

		if (rows < 5) {
			$('#remrow').prop('disabled', true);
			$('.remcon').prop('disabled', true);
		} else {
			$('#remrow').prop('disabled', false);
			$('.remcon').prop('disabled', false);
		}
	}

	$('#solve').click(function () {
		var error = false;

		var columns = $('#model tr:eq(0) td').length;
		var rows = $('#model').find('tr').length;

		var array = {};
		array['c'] = [];
		array['x'] = [];
		array['a'] = [];
		array['b'] = [];
		array['e'] = [];

		$('#model tr').each(function (row, rowValue) {
			if (row > 1 && row < rows - 1) {
				array['a'][row - 2] = [];
			}
			$('#model tr:eq(' + row + ') td').each(function (column, colValue) {
				if (row == 0) {
					if (column > 0 && column < columns - 2) {
						var value = $(colValue).children().get(0).value;
						if (array['type'] == 0) {
							array['c'].push(-parseFloat(value));
						} else {
							array['c'].push(parseFloat(value));
						}
						if (isNaN(parseFloat(value))) {
							error = true;
						}
					}
					if (column == 0) {
						var value = $(colValue).children().get(0).value;
						array['type'] = parseInt(value);
					}
				} else if (row == 1) {
					if (column > 0 && column < columns - 2) {
						var value = $($(colValue).children().get(0)).is(':checked');
						if (value) {
							array['x'].push(1);
						} else {
							array['x'].push(0);
						}
					}
				} else if (row < rows - 1) {
					if (column > 0 && column < columns - 2) {
						var value = $(colValue).children().get(0).value;
						array['a'][row - 2].push(parseFloat(value));
						if (isNaN(parseFloat(value))) {
							error = true;
						}
					} else if (column == columns - 1) {
						var value = $(colValue).children().get(0).value;
						array['b'].push(parseFloat(value));
						if (isNaN(parseFloat(value))) {
							error = true;
						}
					} else if (column == columns - 2) {
						var value = $(colValue).children().get(0).value;
						array['e'].push(parseInt(value));
					}
				}
			});
		});

		if (error) {
			$('#solution').empty();
			$('#solution').append(
				'<hr><h3 class="text-danger text-uppercase">The model is incomplete!</h3><hr>'
			);
		} else {
			$('#solution').empty();
			var request_data = JSON.stringify(array);

			$('#solve').button('loading');
			console.log('Request: ', request_data);

			$.ajax({
				type: 'POST',
				url: 'solve',
				data: request_data,
				success: successFunction,
				dataType: 'json',
				contentType: 'application/json',
			});
		}
	});

	function successFunction(o) {
		console.log('Response: ', o);
		$('#solve').button('reset');

		if (!o['solution']['solved']) {
			$('#solution').empty();
			$('#solution').append(
				'<hr><h3 class="text-danger text-uppercase">could not solve the problem</h3><hr>'
			);
		} else {
			$('#solution').empty();
			$('#solution').append('<hr><h3 class="text-muted">Solution</h3><hr>');
		}

		$('#solution').append(
			'<table style="display:block; max-width:300px;" class="table table-striped table-editor" id="solutionTable"><tbody></tbody></table>'
		);

		var $table = $('#solutionTable tbody');

		$table.append('<tr><td>z</td><td>' + o['solution']['z'] + '</td></tr>');

		for (var i = 0; i < o['solution']['x'].length; i++) {
			$table.append(
				'<tr><td> x' +
					(i + 1) +
					' </td><td>' +
					o['solution']['x'][i] +
					'</td></tr>'
			);
		}

		for (var i = 0; i < o['solution']['s'].length; i++) {
			$table.append(
				'<tr><td> s' +
					(i + 1) +
					' </td><td>' +
					o['solution']['s'][i] +
					'</td></tr>'
			);
		}

		for (var i = 0; i < o['solution']['a'].length; i++) {
			$table.append(
				'<tr><td> a' +
					(i + 1) +
					' </td><td>' +
					o['solution']['a'][i] +
					'</td></tr>'
			);
		}

		$('#solution').append('<hr><h3 class="text-muted">Steps</h3><hr>');

		var steps = o['solution']['steps'];

		steps.forEach(function (step) {
			var text =
				'<div class="step row nopadd"><div style="padding-left:4px;" class="col-xs-3 nopadd"><strong>Step: ' +
				step['step'] +
				'</strong></div>';

			text = text + '<div class="col-xs-4 nopadd">' + step['title'] + '</div>';
			text =
				text +
				'<div class="col-xs-5 nopadd"> ' +
				step['detail'] +
				'</div></div>';

			/*
		else if(step["type"] == 1){
			pivot = 'pivot(' + step["row"] + ',' + step["column"] + ')';
			text = text + '<div class="col-xs-5 nopadd">' + pivot + '</div></div>';
		}
		else if(step["type"] == 2){
			text = text + '<div class="col-xs-5 nopadd">' + step["cut"].toString() + '</div></div>';
		}
		*/

			text = text + addSimplexTablue(step['tablue']);

			$('#solution').append(text);
		});

		$('.step').click(function () {
			$details = $(this).next();
			$details.slideToggle(500);
		});
	}

	function addSimplexTablue(matrix) {
		text =
			'<div class="simplex"><table class="table table-striped table-editor" id="model"><tbody>';

		for (var i = 0; i < matrix.length; i++) {
			text = text + '<tr>';
			for (var j = 0; j < matrix[i].length; j++) {
				if (i == 0) {
					p = ((1 / matrix[i].length) * 100).toFixed(0);
					text = text + "<td width='" + p + "%'>" + matrix[i][j] + '</td>';
				} else {
					p = ((1 / matrix[i].length) * 100).toFixed(0);
					text =
						text +
						"<td width='" +
						p +
						"%'>" +
						Math.round(matrix[i][j] * 1000) / 1000 +
						'</td>';
				}
			}
			text = text + '</tr>';
		}

		text = text + '</tbody></table></div>';

		return text;
	}
});
