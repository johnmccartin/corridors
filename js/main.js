$(document).ready(function(){


	var model = {};
	model.market_units = 0;
	model.affordable_units = 0;
	model.total_gfa = 0;
	model.retail_gfa = 0;

	updateResults();

	/* -----------------------------------
		BUILDING TYPE

		.bldg-type
		type = unique id
		mkt = market rate units
		aff = affordable units
		gfa = total gfa
		retail = supported retail sf
	------------------------------------ */

	/* -----------------------------------
		TARGET SITE

		.target-site
		target = unique id
		mkt = market rate units
		aff = affordable units
		gfa = total gfa
		retail = supported retail sf
	------------------------------------ */
	
	/* -----------------------------------
		RESULTS
		td
			#market-rate
			#affordable
			#total-gfa
			#retail-gfa

	------------------------------------ */


	$('.bldg-type').draggable({
		containment: '.container',
		cursor: 'move',
		helper: 'clone',
	});

	$('.target-site').droppable({
		accept: '.bldg-type-orig',
		drop: handleSiteDrop
	});

	function handleSiteDrop(event, ui) {
		var $d = ui.draggable; //type
		var $t = $(this); //target
		var $dtype = $d.data('type');
		var $target = $t.data('target');


		var $accepts_phys = $t.data('accepts-phys').split(',');
		var $accepts_fin = $t.data('accepts-fin').split(',');
		
		if( $.inArray($dtype,$accepts_phys) > -1 ) {

			model.market_units += $d.data('mkt');
			model.affordable_units += $d.data('aff');
			model.total_gfa += $d.data('gfa');
			model.retail_gfa += $d.data('retail');
			console.log($t.data('bound'));

			$t.attr('data-bound',$dtype);

			$t.append($d.clone().removeClass('bldg-type-orig').addClass('bldg-type-copy'));
			$('.bldg-type-copy').draggable({
				containment: '.container',
				cursor: 'move',
				stop: handleBldgRemove
			});

			updateResults();

			if( $.inArray($dtype,$accepts_fin) > -1 ) {
				//alert('Works financially.');
			} else {
				//alert('Finanical problems')
				financialAlert( $dtype, $target );
			}

		} else {
			console.log('phyical alert');
			var $p = $('.physical-alert');
			$p.removeClass('bottom').addClass('top').addClass('fade-in');
			setTimeout(
				function() {
					$p.removeClass('fade-in');
				},2000
			);
			setTimeout(
				function() {
					$p.removeClass('top').addClass('bottom');
				},2500
			);

		}
	}

	function handleBldgRemove(event,ui) {
		var $d = ui.helper;
		var $dtype = $d[0]['attributes']['data-type']['nodeValue'];

		var $t = $(".target-site[data-bound='"+$dtype+"']");
		

		model.market_units -= $d.data('mkt');
		model.affordable_units -= $d.data('aff');
		model.total_gfa -= $d.data('gfa');
		model.retail_gfa -= $d.data('retail');
		$t.attr('data-bound','x');
		
		updateResults();
		$(ui.helper).fadeOut(250,function(){$(this).remove()});
	

	}

	function updateResults(){
		$('td#market-rate').html(model.market_units);
		$('td#affordable').html(model.affordable_units);
		$('td#total-gfa').html(model.total_gfa);
		$('td#retail-gfa').html(model.retail_gfa);
	}

	function financialAlert( type, target ){
		var $f = $('.financial-alert');
		$f.html('Financial Alert: Building type '+type+' will not generate enough revenue to cover the costs of site '+target+'.');
	}


});