/*
 * core.js
 * Author: Alfred Low (2 July 2011)
 * Copyright: All rights reserved Alfred Low.
 */

var app = {
	/* CONSTANTS */
	ANIMDURATION:2000,
	ID:{
		fixedNav:'fixedNav'
	},
	EASING:'easeOutBounce',
	/* Functions */
	getLinkName: function(o){
		var href=o.attr('href'),
			idx=href.indexOf('#');
		if(idx>=0){
			return href.substring(idx+1);
		} else {
			return false;
		}
	},
	getTargetLink: function(o){
		var name=app.getLinkName(o);
		if(!name) return false;
		var oLink=$('a[name="'+name+'"]');
		if(oLink.length==0){
			oLink=$('#'+name);
			if(oLink.length==0)	return false;
		}
		return oLink;
	},
	getVerticalDiff: function(o1, o2){
		return Math.abs(Math.round(o1.position().top - o2.position().top));
	},
	fixedNav: {
		getVertPos: function(){
			var top=$(window).scrollTop();
			//if(top<452) top=452;
			// Position the bottom of the nav to the bottom of the viewport
			top=top+($(window).height()/2)-$('#'+app.ID.fixedNav).height()-40;
			return(top);
		},
		init: function(){
			var nav=$('.nav').clone();
			nav.attr('id',app.ID.fixedNav);
			$('#content').append(nav);
			$(window).scroll(function(){
				if($('#'+app.ID.fixedNav+':in-viewport').length==0){
					app.fixedNav.reposition();
				}
			});
			
		},
		reposition: function(){
			$('#'+app.ID.fixedNav)
				.clearQueue()
				.animate({'top':app.fixedNav.getVertPos()},app.ANIMDURATION,app.EASING);
		}
	},
	init: function(){
		this.clouds.init();
		this.fixedNav.init();
		this.initScrollTo();
	},
	clouds: {
		init: function(){
			// Choose random starting points
			$('.cloud').each(function(){
				app.clouds.startAnim($(this), true);
			});
			$('.cloud:first')
				.css('top',88);
		},
		startAnim: function(o, randomiseLeft){
			var height=$(document).height()*0.33, // Correcting factor added so clouds not near ground
				width=$(document).width()-160,
				top,left=0,duration;
			duration=Math.round(Math.random()*40000)+60000;
			top=Math.round(Math.random()*height);
			if(randomiseLeft)left=Math.round(Math.random()*(width*0.6));
			o
				.css('top',top)
				.css('left',left)
				.animate({left:width},duration,function(){app.clouds.startAnim($(this),false)});
		}
	},
	initScrollTo: function(){
		$.scrollTo.defaults.duration=app.ANIMDURATION;
		$.scrollTo.defaults.easing=app.EASING;
		$.scrollTo.defaults.offset=-20;
		$('a[href*="#"]').click(function(e){
			var oLink=app.getTargetLink($(this)),
				diff;
			if(oLink){
				diff=app.getVerticalDiff($(this),oLink);
				if(diff<$.scrollTo.defaults.duration) diff=$.scrollTo.defaults.duration;
				$.scrollTo(oLink,{duration:diff, onAfter:app.fixedNav.reposition});
				e.preventDefault();
			}
		});
	}
};

$(document).ready(function(){
	app.init();
});