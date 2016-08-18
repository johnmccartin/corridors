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
		drop: handleDropEvent
	});

	function handleDropEvent(event, ui) {
		var $d = ui.draggable; //type
		var $t = $(this); //target

		var $dtype = $d.data('type');
		var $target = $t.data('target');

		var $accepts_phys = $t.data('accepts-phys').split(',');
		var $accepts_fin = $t.data('accepts-fin').split(',');
		console.log($accepts_phys);
		console.log($accepts_fin);

		
		console.log($.inArray($dtype,$accepts_phys));
		console.log($.inArray($dtype,$accepts_fin));
		if( $.inArray($dtype,$accepts_phys) > -1 ) {
			model.market_units += $d.data('mkt');
			model.affordable_units += $d.data('aff');
			model.total_gfa = $d.data('gfa');
			model.retail_gfa = $d.data('retail');

			$t.html($d.data('type'));

			updateResults();

			if( $.inArray($dtype,$accepts_fin) > -1 ) {
				//alert('Works financially.');
			} else {
				//alert('Finanical problems')
				financialAlert( $dtype, $target );
;			}

		} else {
			alert('Doesn\'t phyically accept.');
		}
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