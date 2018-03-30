//Offset
var offtop = {
    offset: 0,
    param: {
        nav: {},
        header: {},
        prompt: 0,
    },
    construct: function(param){
        this.param = param;
    },
    getValue: function(param){
        this.construct(param);
        
        this.offset = this.param.header.height();
        if(this.offset === 0){
            this.offset = this.param.nav.height();
        }
        
        if(this.param.prompt){
            console.log(this.offset);
        }
        
        return this.offset;
    }
};

//Hotline
var hotline = {
    param: {
        position: 0,
        hotlineHeight: 0,
        outElem: {},
    },
    construct: function(param){
        this.param = param;
    },
    trigger: function(param){
        this.construct(param);
        
        if(this.param.position >= this.param.hotlineHeight){
            this.param.outElem.css({
                'display': 'block',
            });
        }else{
            this.param.outElem.css({
                'display': 'none',
            });
        }
    }
};

//Funnel
var funnel = {
    computed: 0,
    param: {
        position: 0,
        bubble: {},
        triggerElem: {},
        offset: 0,
    },
    construct: function (param) {
        this.param = param;
        this.computed = this.param.triggerElem.height() - this.param.offset;
    },
    trigger: function (param) {
        this.construct(param);
        
        if (this.param.position >= this.computed) {
            this.param.bubble.addClass('fixed');
        }else if (this.param.position < this.computed){
            this.param.bubble.removeClass('fixed');
        }
    }
};

//Fadein/-out - Library
var vis = {
	computed: 0,
	range: 0,
	param: {
		position: 0,
		offset: 0,
		limit: 0,
		outElem: {},
	},
	construct: function(param) {
		this.param = param;
		this.range = this.param.limit - this.param.offset;
	},
	animate: function(){
		//Set
		this.param.outElem.css({
			'opacity': this.computed
		});
	},
	fadein: function (param) {
		this.construct(param)

		//fade-in
		if (this.param.position <= this.param.offset) {
			this.computed = 0;
		} else if (this.param.position >= this.param.limit) {
			this.computed = 1;
		} else {
			this.computed = (1 / this.range) * (this.param.position - this.param.offset);
		}

		this.animate();
	},
	fadeout: function (param) {
		this.construct(param)

		//fade-out
		if (this.param.position <= this.param.offset) {
			this.computed = 1;
		} else if (this.param.position >= this.param.limit) {
			this.computed = 0;
		} else {
			this.computed = 1 - ((1 / this.range) * (this.param.position - this.param.offset));
		}

		this.animate();
	}
};

//Cake-lines
var cakeLine = {
    rect: {},
    radius: 0,
    sideA: 0, sideB: 0, sideC: 0,
    degA: 0, degB: 0, degC: 90,
    cosA: 0,
    newA: 0, newB: 0, newC: 0,
    topOffset: 0, rightOffset: 0,
    assignTo: {},
    param: {},
    prompt: 0, mode: '',
    construct: function(param){
        this.rect = param.rect;
        this.assignTo = param.assignTo;
        this.radius = param.radius;
        this.prompt = param.prompt;
        this.mode = param.mode;
        
        if(this.prompt){
            console.group('Prompt Details:');
        }
    },
    destruct: function(){
        if(this.prompt){
            console.groupEnd();
        }
    },
    main: function(param){
        this.construct(param);
        
        this.getSideC();
        this.getArcCosinus();
        this.getNewRect();
        
        this.getSmallRect();
        
        this.assignToNew();
        this.destruct();
    },
    getSmallRect: function(){
        var halfC = (this.sideC - this.newC) / 2;
        this.topOffset = halfC - ((halfC * Math.sin(this.toRadians(this.degA))) / Math.sin(this.toRadians(this.degC)));
        this.rightOffset = (halfC * Math.sin(this.toRadians(this.degB)) / Math.sin(this.toRadians(this.degC)));
        
        if(this.prompt){
            console.log('HalfC: ' + halfC + '; topOffset: ' + this.topOffset + ' rightOffset: ' + this.rightOffset);
        }
    },
    getSideC: function(){
        this.sideA = this.rect.height();
        this.sideB = this.rect.width();
        this.sideC = Math.sqrt(Math.pow(this.sideA, 2) + Math.pow(this.sideB, 2));
        
        if(this.prompt){
            console.log('Side-a: ' + this.sideA + '; side-b: ' + this.sideB + '; side-c: ' + this.sideC);
        }
    },
    getArcCosinus: function(){
        this.cosA = (Math.pow(this.sideB, 2) + Math.pow(this.sideC, 2) - Math.pow(this.sideA, 2)) / (2 * this.sideB * this.sideC);
        this.degA = this.toDegrees(Math.acos(this.cosA));
        this.degB = this.degC - this.degA;
        
        if(this.prompt){
    		console.log('DegA: ' + this.degA + '; degB: ' + this.degB + '; degC: ' + this.degC);
        }
    },
    getNewRect: function(){
        this.newC = this.radius;
        this.newA = this.sideA - (this.newC * Math.sin(this.toRadians(this.degA))) / Math.sin(this.toRadians(this.degC));
        this.newB = this.sideB - (this.newC * Math.sin(this.toRadians(this.degB))) / Math.sin(this.toRadians(this.degC));
        
        if(this.prompt){
            console.log('Side-a1: ' + this.newA + '; side-b1: ' + this.newB + '; side-c1: ' + this.newC);
        }
    },
    assignToNew: function(){
//        this.assignTo.height(this.newA);
//        this.assignTo.width(this.newB);
//        var rightB = Number(this.rect.css('right').replace('px', '')) + (this.newB / 2) - 25;
//        console.log(rightB);
        
        if(this.mode === 'page1-right'){
            this.assignTo.css({
                height: this.sideC - this.newC,
                transform: 'rotate(' + this.degB + 'deg)',
                top: 'calc(35vh + 46px - ' + this.topOffset + 'px)',
                right: 'calc(35vw + ' + this.rightOffset + 'px)',
            });
        }else if(this.mode === 'page2-right'){
            this.assignTo.css({
                height: this.sideC - this.newC,
                transform: 'rotate(' + this.degB + 'deg)',
                top: 'calc(14vh + 100px - ' + this.topOffset + 'px)',
                right: 'calc(50vw - 132px + ' + this.rightOffset + 'px)',
            });
        }

    },
    toDegrees: function(angle) {
        return angle * (180 / Math.PI);
    },
    toRadians: function(angle) {
        return angle * (Math.PI / 180);
    }
};