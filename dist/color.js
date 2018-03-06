/* 
	
	Usage
	$('body').colorpicker({
		 // Default options
		zIndex: false,
		position: 'middle-right',
		
		// callbacks
		change: function (e, v){
			console.log(v);
		},
		over: function (e, v){
			console.log(v);
		},
		pick: function (e, v){
			console.log(v);
		}
	});

*/
$.widget( "jroot.colorpicker", {
	version: "1.0.0",
	widgetEventPrefix: "jroot-color-picker",
	options: {
        // Default options
		zIndex: false,
		position: 'middle-right',
		setColor: null,
		alpha: 1,
		
		// callbacks
		change: null,
		over: null,
		pick: null
    },
	activeColor : null , 
	activeSelector : null , 
	/* jrootColorPicker */
	_create: function() {
		console.log('fn loaded');
		var thisR = this;
		this.activeSelector = this;
		$(document).on('click','pallet-block > ul > li', function (){
			var x = $(this).attr('data-target');
			var colorPallets = thisR._getColorPallets() ;
			var activeColorPalletsSlots = thisR._activePallet(colorPallets[x]);
			$('active-pallet').html(activeColorPalletsSlots);
			
		});
		
		$(document).on('keyup , change , past','*[name="manual-color"]', function (){
			var x = $(this).val();
			if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(x)){
				thisR._setColor(x); 
				$('jroot-color-picker el-block change-pallet color-block').add().css('background-color',x);
				thisR._trigger( "pick", null, thisR.getColor() );
				$('*[name="manual-color"]').val(thisR.getColor());
				$( "#color-alpha" ).slider( "option", "value" , 1 );
				var newAlpha = 1;
				var bg = thisR._hexToRgbA(thisR.getColor());
				var a = bg.split(',');
				console.log(a);
				var newBg ='rgba('+parseInt(a[0])+','+parseInt(a[1])+','+parseInt(a[2])+','+newAlpha+')' ;
				console.log('linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
				$( "manual-color .code-code .ui-slider" ).add().css('background' , 'linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
			}else if(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.test(x)){
				thisR._setColor(x); 
				$('jroot-color-picker el-block change-pallet color-block').add().css('background-color',x);
				thisR._trigger( "pick", null, thisR.getColor() );
				$('*[name="manual-color"]').val(thisR.getColor());
				var newAlpha = 1;
				var bg = thisR.getColor();
				console.log('bg-bfore' , bg);
				var bg = bg.replace("r", "");
				var bg = bg.replace("g", "");
				var bg = bg.replace("b", "");
				var bg = bg.replace("a", "");
				var bg = bg.replace("(", "");
				var bg = bg.replace(")", "");
				console.log('bg' , bg);
				var a = bg.split(',');
				console.log(a);
				if(a.length == 3){
					
				}else if(a.length == 4){
					newAlpha = parseFloat(a[3]);
				}
				var newBg ='rgba('+parseInt(a[0])+','+parseInt(a[1])+','+parseInt(a[2])+',1)' ;
				console.log('linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
				$( "#color-alpha" ).slider( "option", "value" , newAlpha );
				$( "manual-color .code-code .ui-slider" ).add().css('background' , 'linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
			}
		});
		$(document).on('click','active-pallet ul li', function (){
			var x = $(this).attr('data-color');
			thisR._setColor(x); 
			$('jroot-color-picker el-block change-pallet color-block').add().css('background-color',x);
			thisR._trigger( "pick", null, thisR.getColor() );
			$('*[name="manual-color"]').val(thisR.getColor());
			$( "#color-alpha" ).slider( "option", "value" , 1 );
			var newAlpha = 1;
			var bg = thisR._hexToRgbA(thisR.getColor());
			var a = bg.split(',');
			var newBg ='rgba('+parseInt(a[0])+','+parseInt(a[1])+','+parseInt(a[2])+','+newAlpha+')' ;
			$( "manual-color .code-code .ui-slider" ).add().css('background' , 'linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
		});
		$(document).on('mouseover','active-pallet ul li', function (){
			var x = $(this).attr('data-color');
			thisR._trigger( "over", null, thisR.getColor());
		});
		
		$(document).on('click','*[data-roll="jroot-color-picker-close"]', function (){
			$('jroot-color-picker').remove();
			if(thisR.getColor().indexOf('rgb') !== -1){
				var newAlpha = thisR.options.alpha;
				console.log(thisR.getColor());
				var bg = thisR.getColor();
				bg = bg.replace('rgba', '');
				console.log(bg);
				var a = bg.split(',');
				var newBg = bg.replace('rgba', '');
				var newBg ='rgba('+a[0]+','+parseInt(a[1])+','+parseInt(a[2])+','+newAlpha+')' ;
				var newBg = newBg.replace('((', '(');
				console.log(newBg);
				thisR._trigger( "change", null, newBg );
			}else{
				thisR._trigger( "change", null, thisR.getColor() );
			}
			
		});
		
    },
	_init : function (){
		this.run();
	},
	run: function (){
		console.log(this.options.setColor);
		var colorPallets = this._getColorPallets() ;
		colorPalletsList = '' ;
		for(var i = 0 ; i < 100 ; i++){
			var p = colorPallets[i];
			colorPalletsList += '<li data-target="'+i+'">';
			for(var k = 0 ; k < p.length ; k++){
				colorPalletsList += '<span style="background:'+p[k]+'"></span>';
			}
			colorPalletsList += '<li>';
		}
		var activeColorPalletsSlots = '' ;
		var p = colorPallets[0];
		activeColorPalletsSlots = this._activePallet(p);
		var mC = '';
		var mCVal = '';
		console.log('this.setColor' , this.options.setColor);
		if(this.options.setColor != null){
			mC = 'background-color:' + this.options.setColor+ ';' ;
			mCVal = this._rgb2hex( this.options.setColor );
			console.log(mCVal);
		}
		var h = '<jroot-color-picker class="jroot-color-picker '+this.options.position+'">'+
					'<heading>'+
						'<label>Color Editor</label>'+
						'<controll>'+
							'<icon class="fa fa-times" data-roll="jroot-color-picker-close"></icon>'+
						'</controll>'+
					'</heading>'+
					'<el-block>'+
						'<change-pallet>'+
							'<label>Selected Color</label>'+
							'<color-block style="'+mC+'"></color-block>'+
						'</change-pallet>'+
						'<active-pallet>'+
							activeColorPalletsSlots + 
						'</active-pallet>'+
						'<manual-color>'+
							'<div class="code-code">'+
								'<label>Color Code</label>'+
								'<input type="text" name="manual-color" value="'+mCVal+'"/>'+
							'</div>'+
							'<div class="code-code">'+
								'<label>Transparency</label>'+
								'<div id="color-alpha"></div>'+
							'</div>'+
						'</manual-color>'+
						'<action-buttons>'+
							'<button class="btn btn-success" data-roll="jroot-color-picker-close">Change</button>'+
							'<button class="btn btn-primary" data-roll="jroot-color-picker-close">Cancel</button>'+
						'</action-buttons>'+
					'</el-block>'+
					'<pallet-block>'+
						'<label>Color Pallets</label>'+
						'<ul>'+
							colorPalletsList + 
						'</ul>'+
					'</pallet-block>'+
				'</jroot-color-picker>';
		this.element.append(h);
		var thisR = this;
		var newAlpha = 1 ; 
		var newBg = 'rgba(0,0,0,1)';
		if(thisR.options.setColor.indexOf('rgb') !== -1){
			var bg = thisR.options.setColor;
			
			var bg = bg.replace("r", "");
			var bg = bg.replace("g", "");
			var bg = bg.replace("b", "");
			var bg = bg.replace("a", "");
			var bg = bg.replace("(", "");
			var bg = bg.replace(")", "");
			var a = bg.split(',');
			console.log(a);
			if(a.length == 3){
				
			}else if(a.length == 4){
				newAlpha = parseFloat(a[3]);
			}
			var newBg ='rgba('+parseInt(a[0])+','+parseInt(a[1])+','+parseInt(a[2])+','+newAlpha+')' ;
			$('jroot-color-picker el-block change-pallet color-block').add().css('background-color',newBg);
		}else{
			$('jroot-color-picker el-block change-pallet color-block').add().css('background-color',thisR.options.setColor);
		}
		
		$( "#color-alpha" ).slider({
		  min: 0.0,
		  step: 0.1,
		  value: newAlpha,
		  max: 1.0,
		  animate: "fast",
		  create: function( event, ui ) {
			 $( "manual-color .code-code .ui-slider" ).add().css('background' , 'linear-gradient(to right, rgba(255,255,255,0) 0%, '+newBg+' 100%)');
		  },
		  slide: function( event, ui ) {
			console.log(ui.value);
			thisR.options.alpha = ui.value;
			var newAlpha = ui.value;
			var bg = $('color-block').css('background-color');
			var a = bg.slice(4).split(',');
			var newBg ='rgba('+a[0]+','+parseInt(a[1])+','+parseInt(a[2])+','+newAlpha+')' ;
			var newBg = newBg.replace('((', '(');
			$('color-block').add().css('background-color',newBg);
			thisR._setColor(newBg)
			//$('*[name="manual-color"]').val(newBg);
		  }
		});
	},
	
	getColor : function (){
		return this.activeColor ;
	},
	_setColor : function (x){
		this.activeColor = x ;
	},
	
	_getColorPallets : function (){
		return [["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900"],["#fe4365","#fc9d9a","#f9cdad","#c8c8a9","#83af9b"],["#ecd078","#d95b43","#c02942","#542437","#53777a"],["#556270","#4ecdc4","#c7f464","#ff6b6b","#c44d58"],["#774f38","#e08e79","#f1d4af","#ece5ce","#c5e0dc"],["#e8ddcb","#cdb380","#036564","#033649","#031634"],["#490a3d","#bd1550","#e97f02","#f8ca00","#8a9b0f"],["#594f4f","#547980","#45ada8","#9de0ad","#e5fcc2"],["#00a0b0","#6a4a3c","#cc333f","#eb6841","#edc951"],["#e94e77","#d68189","#c6a49a","#c6e5d9","#f4ead5"],["#3fb8af","#7fc7af","#dad8a7","#ff9e9d","#ff3d7f"],["#d9ceb2","#948c75","#d5ded9","#7a6a53","#99b2b7"],["#ffffff","#cbe86b","#f2e9e1","#1c140d","#cbe86b"],["#efffcd","#dce9be","#555152","#2e2633","#99173c"],["#343838","#005f6b","#008c9e","#00b4cc","#00dffc"],["#413e4a","#73626e","#b38184","#f0b49e","#f7e4be"],["#ff4e50","#fc913a","#f9d423","#ede574","#e1f5c4"],["#99b898","#fecea8","#ff847c","#e84a5f","#2a363b"],["#655643","#80bca3","#f6f7bd","#e6ac27","#bf4d28"],["#00a8c6","#40c0cb","#f9f2e7","#aee239","#8fbe00"],["#351330","#424254","#64908a","#e8caa4","#cc2a41"],["#554236","#f77825","#d3ce3d","#f1efa5","#60b99a"],["#ff9900","#424242","#e9e9e9","#bcbcbc","#3299bb"],["#5d4157","#838689","#a8caba","#cad7b2","#ebe3aa"],["#8c2318","#5e8c6a","#88a65e","#bfb35a","#f2c45a"],["#fad089","#ff9c5b","#f5634a","#ed303c","#3b8183"],["#ff4242","#f4fad2","#d4ee5e","#e1edb9","#f0f2eb"],["#d1e751","#ffffff","#000000","#4dbce9","#26ade4"],["#f8b195","#f67280","#c06c84","#6c5b7b","#355c7d"],["#1b676b","#519548","#88c425","#bef202","#eafde6"],["#bcbdac","#cfbe27","#f27435","#f02475","#3b2d38"],["#5e412f","#fcebb6","#78c0a8","#f07818","#f0a830"],["#452632","#91204d","#e4844a","#e8bf56","#e2f7ce"],["#eee6ab","#c5bc8e","#696758","#45484b","#36393b"],["#f0d8a8","#3d1c00","#86b8b1","#f2d694","#fa2a00"],["#f04155","#ff823a","#f2f26f","#fff7bd","#95cfb7"],["#2a044a","#0b2e59","#0d6759","#7ab317","#a0c55f"],["#bbbb88","#ccc68d","#eedd99","#eec290","#eeaa88"],["#b9d7d9","#668284","#2a2829","#493736","#7b3b3b"],["#b3cc57","#ecf081","#ffbe40","#ef746f","#ab3e5b"],["#a3a948","#edb92e","#f85931","#ce1836","#009989"],["#67917a","#170409","#b8af03","#ccbf82","#e33258"],["#e8d5b7","#0e2430","#fc3a51","#f5b349","#e8d5b9"],["#aab3ab","#c4cbb7","#ebefc9","#eee0b7","#e8caaf"],["#300030","#480048","#601848","#c04848","#f07241"],["#ab526b","#bca297","#c5ceae","#f0e2a4","#f4ebc3"],["#607848","#789048","#c0d860","#f0f0d8","#604848"],["#a8e6ce","#dcedc2","#ffd3b5","#ffaaa6","#ff8c94"],["#3e4147","#fffedf","#dfba69","#5a2e2e","#2a2c31"],["#b6d8c0","#c8d9bf","#dadabd","#ecdbbc","#fedcba"],["#fc354c","#29221f","#13747d","#0abfbc","#fcf7c5"],["#1c2130","#028f76","#b3e099","#ffeaad","#d14334"],["#edebe6","#d6e1c7","#94c7b6","#403b33","#d3643b"],["#cc0c39","#e6781e","#c8cf02","#f8fcc1","#1693a7"],["#dad6ca","#1bb0ce","#4f8699","#6a5e72","#563444"],["#a7c5bd","#e5ddcb","#eb7b59","#cf4647","#524656"],["#fdf1cc","#c6d6b8","#987f69","#e3ad40","#fcd036"],["#5c323e","#a82743","#e15e32","#c0d23e","#e5f04c"],["#230f2b","#f21d41","#ebebbc","#bce3c5","#82b3ae"],["#b9d3b0","#81bda4","#b28774","#f88f79","#f6aa93"],["#3a111c","#574951","#83988e","#bcdea5","#e6f9bc"],["#5e3929","#cd8c52","#b7d1a3","#dee8be","#fcf7d3"],["#1c0113","#6b0103","#a30006","#c21a01","#f03c02"],["#382f32","#ffeaf2","#fcd9e5","#fbc5d8","#f1396d"],["#e3dfba","#c8d6bf","#93ccc6","#6cbdb5","#1a1f1e"],["#000000","#9f111b","#b11623","#292c37","#cccccc"],["#c1b398","#605951","#fbeec2","#61a6ab","#accec0"],["#8dccad","#988864","#fea6a2","#f9d6ac","#ffe9af"],["#f6f6f6","#e8e8e8","#333333","#990100","#b90504"],["#1b325f","#9cc4e4","#e9f2f9","#3a89c9","#f26c4f"],["#5e9fa3","#dcd1b4","#fab87f","#f87e7b","#b05574"],["#951f2b","#f5f4d7","#e0dfb1","#a5a36c","#535233"],["#413d3d","#040004","#c8ff00","#fa023c","#4b000f"],["#eff3cd","#b2d5ba","#61ada0","#248f8d","#605063"],["#2d2d29","#215a6d","#3ca2a2","#92c7a3","#dfece6"],["#cfffdd","#b4dec1","#5c5863","#a85163","#ff1f4c"],["#4e395d","#827085","#8ebe94","#ccfc8e","#dc5b3e"],["#9dc9ac","#fffec7","#f56218","#ff9d2e","#919167"],["#a1dbb2","#fee5ad","#faca66","#f7a541","#f45d4c"],["#ffefd3","#fffee4","#d0ecea","#9fd6d2","#8b7a5e"],["#a8a7a7","#cc527a","#e8175d","#474747","#363636"],["#ffedbf","#f7803c","#f54828","#2e0d23","#f8e4c1"],["#f8edd1","#d88a8a","#474843","#9d9d93","#c5cfc6"],["#f38a8a","#55443d","#a0cab5","#cde9ca","#f1edd0"],["#4e4d4a","#353432","#94ba65","#2790b0","#2b4e72"],["#0ca5b0","#4e3f30","#fefeeb","#f8f4e4","#a5b3aa"],["#a70267","#f10c49","#fb6b41","#f6d86b","#339194"],["#9d7e79","#ccac95","#9a947c","#748b83","#5b756c"],["#edf6ee","#d1c089","#b3204d","#412e28","#151101"],["#046d8b","#309292","#2fb8ac","#93a42a","#ecbe13"],["#4d3b3b","#de6262","#ffb88c","#ffd0b3","#f5e0d3"],["#fffbb7","#a6f6af","#66b6ab","#5b7c8d","#4f2958"],["#ff003c","#ff8a00","#fabe28","#88c100","#00c176"],["#fcfef5","#e9ffe1","#cdcfb7","#d6e6c3","#fafbe3"],["#9cddc8","#bfd8ad","#ddd9ab","#f7af63","#633d2e"],["#30261c","#403831","#36544f","#1f5f61","#0b8185"],["#d1313d","#e5625c","#f9bf76","#8eb2c5","#615375"],["#ffe181","#eee9e5","#fad3b2","#ffba7f","#ff9c97"],["#aaff00","#ffaa00","#ff00aa","#aa00ff","#00aaff"],["#c2412d","#d1aa34","#a7a844","#a46583","#5a1e4a"],["#75616b","#bfcff7","#dce4f7","#f8f3bf","#d34017"],["#805841","#dcf7f3","#fffcdd","#ffd8d8","#f5a2a2"],["#379f7a","#78ae62","#bbb749","#e0fbac","#1f1c0d"],["#73c8a9","#dee1b6","#e1b866","#bd5532","#373b44"],["#caff42","#ebf7f8","#d0e0eb","#88abc2","#49708a"],["#7e5686","#a5aad9","#e8f9a2","#f8a13f","#ba3c3d"],["#82837e","#94b053","#bdeb07","#bffa37","#e0e0e0"],["#111625","#341931","#571b3c","#7a1e48","#9d2053"],["#312736","#d4838f","#d6abb1","#d9d9d9","#c4ffeb"],["#84b295","#eccf8d","#bb8138","#ac2005","#2c1507"],["#395a4f","#432330","#853c43","#f25c5e","#ffa566"],["#fde6bd","#a1c5ab","#f4dd51","#d11e48","#632f53"],["#6da67a","#77b885","#86c28b","#859987","#4a4857"],["#bed6c7","#adc0b4","#8a7e66","#a79b83","#bbb2a1"],["#058789","#503d2e","#d54b1a","#e3a72f","#f0ecc9"],["#e21b5a","#9e0c39","#333333","#fbffe3","#83a300"],["#261c21","#6e1e62","#b0254f","#de4126","#eb9605"],["#b5ac01","#ecba09","#e86e1c","#d41e45","#1b1521"],["#efd9b4","#d6a692","#a39081","#4d6160","#292522"],["#fbc599","#cdbb93","#9eae8a","#335650","#f35f55"],["#c75233","#c78933","#d6ceaa","#79b5ac","#5e2f46"],["#793a57","#4d3339","#8c873e","#d1c5a5","#a38a5f"],["#f2e3c6","#ffc6a5","#e6324b","#2b2b2b","#353634"],["#512b52","#635274","#7bb0a8","#a7dbab","#e4f5b1"],["#59b390","#f0ddaa","#e47c5d","#e32d40","#152b3c"],["#fdffd9","#fff0b8","#ffd6a3","#faad8e","#142f30"],["#11766d","#410936","#a40b54","#e46f0a","#f0b300"],["#11644d","#a0b046","#f2c94e","#f78145","#f24e4e"],["#c7fcd7","#d9d5a7","#d9ab91","#e6867a","#ed4a6a"],["#595643","#4e6b66","#ed834e","#ebcc6e","#ebe1c5"],["#331327","#991766","#d90f5a","#f34739","#ff6e27"],["#bf496a","#b39c82","#b8c99d","#f0d399","#595151"],["#f1396d","#fd6081","#f3ffeb","#acc95f","#8f9924"],["#efeecc","#fe8b05","#fe0557","#400403","#0aabba"],["#e5eaa4","#a8c4a2","#69a5a4","#616382","#66245b"],["#e9e0d1","#91a398","#33605a","#070001","#68462b"],["#e4ded0","#abccbd","#7dbeb8","#181619","#e32f21"],["#e0eff1","#7db4b5","#ffffff","#680148","#000000"],["#b7cbbf","#8c886f","#f9a799","#f4bfad","#f5dabd"],["#ffb884","#f5df98","#fff8d4","#c0d1c2","#2e4347"],["#6da67a","#99a66d","#a9bd68","#b5cc6a","#c0de5d"],["#b1e6d1","#77b1a9","#3d7b80","#270a33","#451a3e"],["#fc284f","#ff824a","#fea887","#f6e7f7","#d1d0d7"],["#ffab07","#e9d558","#72ad75","#0e8d94","#434d53"],["#311d39","#67434f","#9b8e7e","#c3ccaf","#a51a41"],["#5cacc4","#8cd19d","#cee879","#fcb653","#ff5254"],["#44749d","#c6d4e1","#ffffff","#ebe7e0","#bdb8ad"],["#cfb590","#9e9a41","#758918","#564334","#49281f"],["#e4e4c5","#b9d48b","#8d2036","#ce0a31","#d3e4c5"],["#ccf390","#e0e05a","#f7c41f","#fc930a","#ff003d"],["#807462","#a69785","#b8faff","#e8fdff","#665c49"],["#ec4401","#cc9b25","#13cd4a","#7b6ed6","#5e525c"],["#cc5d4c","#fffec6","#c7d1af","#96b49c","#5b5847"],["#e3e8cd","#bcd8bf","#d3b9a3","#ee9c92","#fe857e"],["#360745","#d61c59","#e7d84b","#efeac5","#1b8798"],["#2b222c","#5e4352","#965d62","#c7956d","#f2d974"],["#e7edea","#ffc52c","#fb0c06","#030d4f","#ceecef"],["#eb9c4d","#f2d680","#f3ffcf","#bac9a9","#697060"],["#fff3db","#e7e4d5","#d3c8b4","#c84648","#703e3b"],["#f5dd9d","#bcc499","#92a68a","#7b8f8a","#506266"],["#f2e8c4","#98d9b6","#3ec9a7","#2b879e","#616668"],["#041122","#259073","#7fda89","#c8e98e","#e6f99d"],["#c6cca5","#8ab8a8","#6b9997","#54787d","#615145"],["#4b1139","#3b4058","#2a6e78","#7a907c","#c9b180"],["#8d7966","#a8a39d","#d8c8b8","#e2ddd9","#f8f1e9"],["#2d1b33","#f36a71","#ee887a","#e4e391","#9abc8a"],["#95a131","#c8cd3b","#f6f1de","#f5b9ae","#ee0b5b"],["#79254a","#795c64","#79927d","#aeb18e","#e3cf9e"],["#429398","#6b5d4d","#b0a18f","#dfcdb4","#fbeed3"],["#1d1313","#24b694","#d22042","#a3b808","#30c4c9"],["#9d9e94","#c99e93","#f59d92","#e5b8ad","#d5d2c8"],["#f0ffc9","#a9da88","#62997a","#72243d","#3b0819"],["#322938","#89a194","#cfc89a","#cc883a","#a14016"],["#452e3c","#ff3d5a","#ffb969","#eaf27e","#3b8c88"],["#f06d61","#da825f","#c4975c","#a8ab7b","#8cbf99"],["#540045","#c60052","#ff714b","#eaff87","#acffe9"],["#2b2726","#0a516d","#018790","#7dad93","#bacca4"],["#027b7f","#ffa588","#d62957","#bf1e62","#572e4f"],["#23192d","#fd0a54","#f57576","#febf97","#f5ecb7"],["#fa6a64","#7a4e48","#4a4031","#f6e2bb","#9ec6b8"],["#a3c68c","#879676","#6e6662","#4f364a","#340735"],["#f6d76b","#ff9036","#d6254d","#ff5475","#fdeba9"],["#80a8a8","#909d9e","#a88c8c","#ff0d51","#7a8c89"],["#a32c28","#1c090b","#384030","#7b8055","#bca875"],["#6d9788","#1e2528","#7e1c13","#bf0a0d","#e6e1c2"],["#373737","#8db986","#acce91","#badb73","#efeae4"],["#280904","#680e34","#9a151a","#c21b12","#fc4b2a"],["#fb6900","#f63700","#004853","#007e80","#00b9bd"],["#e6b39a","#e6cba5","#ede3b4","#8b9e9b","#6d7578"],["#641f5e","#676077","#65ac92","#c2c092","#edd48e"],["#a69e80","#e0ba9b","#e7a97e","#d28574","#3b1922"],["#161616","#c94d65","#e7c049","#92b35a","#1f6764"],["#234d20","#36802d","#77ab59","#c9df8a","#f0f7da"],["#4b3e4d","#1e8c93","#dbd8a2","#c4ac30","#d74f33"],["#ff7474","#f59b71","#c7c77f","#e0e0a8","#f1f1c1"],["#e6eba9","#abbb9f","#6f8b94","#706482","#703d6f"],["#26251c","#eb0a44","#f2643d","#f2a73d","#a0e8b7"],["#fdcfbf","#feb89f","#e23d75","#5f0d3b","#742365"],["#230b00","#a29d7f","#d4cfa5","#f8ecd4","#aabe9b"],["#85847e","#ab6a6e","#f7345b","#353130","#cbcfb4"],["#d4f7dc","#dbe7b4","#dbc092","#e0846d","#f51441"],["#d3d5b0","#b5cea4","#9dc19d","#8c7c62","#71443f"],["#4f364c","#5e405f","#6b6b6b","#8f9e6f","#b1cf72"],["#bfcdb4","#f7e5bf","#ead2a4","#efb198","#7d5d4e"],["#6f5846","#a95a52","#e35b5d","#f18052","#ffa446"],["#ff3366","#c74066","#8f4d65","#575a65","#1f6764"],["#ffff99","#d9cc8c","#b39980","#8c6673","#663366"],["#c46564","#f0e999","#b8c99d","#9b726f","#eeb15b"],["#eeda95","#b7c27e","#9a927b","#8a6a6b","#805566"],["#62a07b","#4f8b89","#536c8d","#5c4f79","#613860"],["#1a081f","#4d1d4d","#05676e","#489c79","#ebc288"],["#f0f0d8","#b4debe","#77cca4","#666666","#b4df37"],["#ed6464","#bf6370","#87586c","#574759","#1a1b1c"],["#ccb24c","#f7d683","#fffdc0","#fffffd","#457d97"],["#7a5b3e","#fafafa","#fa4b00","#cdbdae","#1f1f1f"],["#566965","#948a71","#cc9476","#f2a176","#ff7373"],["#d31900","#ff6600","#fff2af","#7cb490","#000000"],["#d24858","#ea8676","#eab05e","#fdeecd","#493831"],["#ebeaa9","#ebc588","#7d2948","#3b0032","#0e0b29"],["#411f2d","#ac4147","#f88863","#ffc27f","#ffe29a"],["#e7e79d","#c0d890","#78a890","#606078","#d8a878"],["#9dbcbc","#f0f0af","#ff370f","#332717","#6bacbf"],["#063940","#195e63","#3e838c","#8ebdb6","#ece1c3"],["#e8c382","#b39d69","#a86b4c","#7d1a0c","#340a0b"],["#94654c","#f89fa1","#fabdbd","#fad6d6","#fefcd0"],["#595b5a","#14c3a2","#0de5a8","#7cf49a","#b8fd99"],["#cddbc2","#f7e4c6","#fb9274","#f5565b","#875346"],["#f0ddbd","#ba3622","#851e25","#520c30","#1c997f"],["#312c20","#494d4b","#7c7052","#b3a176","#e2cb92"],["#e7dd96","#e16639","#ad860a","#b7023f","#55024a"],["#574c41","#e36b6b","#e3a56b","#e3c77b","#96875a"],["#3f2c26","#dd423e","#a2a384","#eac388","#c5ad4b"],["#0a0310","#49007e","#ff005b","#ff7d10","#ffb238"],["#cdeccc","#edd269","#e88460","#f23460","#321d2e"],["#1f1f20","#2b4c7e","#567ebb","#606d80","#dce0e6"],["#f3e7d7","#f7d7cd","#f8c7c9","#e0c0c7","#c7b9c5"],["#ecbe13","#738c79","#6a6b5f","#2c2b26","#a43955"],["#dde0cf","#c6be9a","#ad8b32","#937460","#8c5b7b"],["#181419","#4a073c","#9e0b41","#cc3e18","#f0971c"],["#029daf","#e5d599","#ffc219","#f07c19","#e32551"],["#fff5de","#b8d9c8","#917081","#750e49","#4d002b"],["#4d3b36","#eb613b","#f98f6f","#c1d9cd","#f7eadc"],["#413040","#6c6368","#b9a173","#eaa353","#ffefa9"],["#ffcdb8","#fdeecf","#c8c696","#97bea9","#37260c"],["#213435","#46685b","#648a64","#a6b985","#e1e3ac"],["#ffffff","#fffaeb","#f0f0d8","#cfcfcf","#967c52"],["#e8d3a9","#e39b7d","#6e6460","#89b399","#bcbfa3"],["#ed5672","#160e32","#9eae8a","#cdbb93","#fbc599"],["#001449","#012677","#005bc5","#00b4fc","#17f9ff"],["#4dab8c","#542638","#8f244d","#c9306b","#e86f9e"],["#67be9b","#95d0b8","#fcfcd7","#f1db42","#f04158"],["#2b1719","#02483e","#057c46","#9bb61b","#f8be00"],["#ffff00","#ccd91a","#99b333","#668c4d","#336666"],["#130912","#3e1c33","#602749","#b14623","#f6921d"],["#e7eed0","#cad1c3","#948e99","#51425f","#2e1437"],["#e25858","#e9d6af","#ffffdd","#c0efd2","#384252"],["#e6a06f","#9e9c71","#5e8271","#33454e","#242739"],["#faf6d0","#c7d8ab","#909a92","#744f78","#30091e"],["#acdeb2","#e1eab5","#edad9e","#fe4b74","#390d2d"],["#42282c","#6ca19e","#84abaa","#ded1b6","#6d997a"],["#9f0a28","#d55c2b","#f6e7d3","#89a46f","#55203c"],["#418e8e","#5a4e3c","#c4d428","#d8e472","#e9ebbf"],["#1693a5","#45b5c4","#7ececa","#a0ded6","#c7ede8"],["#fdffd9","#73185e","#36bba6","#0c0d02","#8b911a"],["#a69a90","#4a403d","#fff1c1","#facf7d","#ea804c"],["#f7f3d5","#ffdabf","#fa9b9b","#e88087","#635063"],["#8a8780","#e6e5c4","#d6d1af","#e47267","#d7d8c5"],["#a7cd2c","#bada5f","#cee891","#e1f5c4","#50c8c6"],["#b2cba3","#e0df9f","#e7a83e","#9a736e","#ea525f"],["#aadead","#bbdead","#ccdead","#dddead","#eedead"],["#fc580c","#fc6b0a","#f8872e","#ffa927","#fdca49"],["#fa2e59","#ff703f","#f7bc05","#ecf6bb","#76bcad"],["#785d56","#be4c54","#c6b299","#e6d5c1","#fff4e3"],["#f0371a","#000000","#f7e6a6","#3e6b48","#b5b479"],["#cc2649","#992c4b","#66324c","#33384e","#003e4f"],["#ffabab","#ffdaab","#ddffab","#abe4ff","#d9abff"],["#f1e8b4","#b2bb91","#d7bf5e","#d16344","#83555e"],["#42393b","#75c9a3","#bac99a","#ffc897","#f7efa2"],["#a7321c","#ffdc68","#cc982a","#928941","#352504"],["#e0dc8b","#f6aa3d","#ed4c57","#574435","#6cc4b9"],["#000000","#001f36","#1c5560","#79ae92","#fbffcd"],["#f6c7b7","#f7a398","#fa7f77","#b42529","#000000"],["#c9d1d3","#f7f7f7","#9dd3df","#3b3737","#991818"],["#afc7b9","#ffe1c9","#fac7b4","#fca89d","#998b82"],["#fbfee5","#c91842","#98173d","#25232d","#a8e7ca"],["#f3e6bc","#f1c972","#f5886b","#72ae95","#5a3226"],["#fa8cb1","#fdc5c9","#fffee1","#cfb699","#9e6d4e"],["#674f23","#e48b69","#e1b365","#e5db84","#ffeeac"],["#dbd9b7","#c1c9c8","#a5b5ab","#949a8e","#615566"],["#f2cc67","#f38264","#f40034","#5f051f","#75baa8"],["#d9d4a8","#d15c57","#cc3747","#5c374b","#4a5f67"],["#84c1b1","#ad849a","#d64783","#fd135a","#40202a"],["#71dbd2","#eeffdb","#ade4b5","#d0eaa3","#fff18c"],["#b88000","#d56f00","#f15500","#ff2654","#ff0c71"],["#020304","#541f14","#938172","#cc9e61","#626266"],["#f4f4f4","#9ba657","#f0e5c9","#a68c69","#594433"],["#244242","#51bd9c","#a3e3b1","#ffe8b3","#ff2121"],["#1f0310","#442433","#a3d95b","#aae3ab","#f6f0bc"],["#00ccbe","#09a6a3","#9dbfaf","#edebc9","#fcf9d8"],["#4eb3de","#8de0a6","#fcf09f","#f27c7c","#de528c"],["#ff0092","#ffca1b","#b6ff00","#228dff","#ba01ff"],["#ffc870","#f7f7c6","#c8e3c5","#9cad9a","#755858"],["#4c3d31","#f18273","#f2bd76","#f4f5de","#c4ceb0"],["#84bfc3","#fff5d6","#ffb870","#d96153","#000511"],["#fffdc0","#b9d7a1","#fead26","#ca221f","#590f0c"],["#241811","#d4a979","#e3c88f","#c2c995","#a8bd95"],["#2197a3","#f71e6c","#f07868","#ebb970","#e7d3b0"],["#b2b39f","#c8c9b5","#dedfc5","#f5f7bd","#3d423c"],["#b31237","#f03813","#ff8826","#ffb914","#2c9fa3"],["#15212a","#99c9bd","#d7b89c","#feab8d","#f4c9a3"],["#002c2b","#ff3d00","#ffbc11","#0a837f","#076461"],["#f88f89","#eec276","#fbf6d0","#79c3aa","#1f0e1a"],["#bf2a23","#a6ad3c","#f0ce4e","#cf872e","#8a211d"],["#e2df9a","#ebe54d","#757449","#4b490b","#ff0051"],["#001848","#301860","#483078","#604878","#906090"],["#85a29e","#ffebbf","#f0d442","#f59330","#b22148"],["#79a687","#718063","#67594d","#4f2b38","#1d1016"],["#fe6c2b","#d43b2d","#9f102c","#340016","#020001"],["#e6e1cd","#c6d8c0","#d6b3b1","#f97992","#231b42"],["#69d0b3","#9bdab3","#b4dfb3","#cde4b3","#d9cf85"],["#75372d","#928854","#96a782","#d4ce9e","#d8523d"],["#651366","#a71a5b","#e7204e","#f76e2a","#f0c505"],["#ffffff","#a1c1be","#59554e","#f3f4e5","#e2e3d9"],["#332c26","#db1414","#e8591c","#7fb8b0","#c5e65c"],["#2f2bad","#ad2bad","#e42692","#f71568","#f7db15"],["#8e407a","#fe6962","#f9ba84","#eee097","#ffffe5"],["#45aab8","#e1d772","#faf4b1","#394240","#f06b50"],["#ccded2","#fffbd4","#f5ddbb","#e3b8b2","#a18093"],["#d1b68d","#87555c","#492d49","#51445f","#5a5c75"],["#539fa2","#72b1a4","#abccb1","#c4dbb4","#d4e2b6"],["#80d3bb","#bafdc2","#e5f3ba","#5c493d","#3a352f"],["#a8bcbd","#fcdcb3","#f88d87","#d65981","#823772"],["#ffe4aa","#fca699","#e2869b","#c9729f","#583b7e"],["#b5f4bc","#fff19e","#ffdc8a","#ffba6b","#ff6543"],["#ff4746","#e8da5e","#92b55f","#487d76","#4b4452"],["#002e34","#004443","#00755c","#00c16c","#90ff17"],["#101942","#80043a","#f60c49","#f09580","#fdf2b4"],["#0fc3e8","#0194be","#e2d397","#f07e13","#481800"],["#c9b849","#c96823","#be3100","#6f0b00","#241714"],["#9e1e4c","#ff1168","#25020f","#8f8f8f","#ececec"],["#272d4d","#b83564","#ff6a5a","#ffb350","#83b8aa"],["#c4ddd6","#d4ddd6","#e4ddd6","#e4e3cd","#ececdd"],["#4d4a4b","#f60069","#ff41a1","#ff90ab","#ffccd1"],["#1f0a1d","#334f53","#45936c","#9acc77","#e5ead4"],["#899aa1","#bda2a2","#fbbe9a","#fad889","#faf5c8"],["#4b538b","#15191d","#f7a21b","#e45635","#d60257"],["#706767","#e87474","#e6a37a","#d9c777","#c0dbab"],["#000000","#ff8830","#d1b8a0","#aeced2","#cbdcdf"],["#db5643","#1c0f0e","#70aa87","#9fb38f","#c5bd99"],["#36173d","#ff4845","#ff745f","#ffc55f","#ffec5e"],["#000706","#00272d","#134647","#0c7e7e","#bfac8b"],["#170132","#361542","#573e54","#85ae72","#bce1ab"],["#aab69b","#9e906e","#9684a3","#8870ff","#000000"],["#d8d8d8","#e2d9d8","#ecdad8","#f5dbd8","#ffdcd8"],["#c8d197","#d89845","#c54b2c","#473430","#11baac"],["#f8f8ec","#aedd2b","#066699","#0a5483","#02416d"],["#d7e8d5","#e6f0af","#e8ed76","#ffcd57","#4a3a47"],["#f1ecdf","#d4c9ad","#c7ba99","#000000","#f58723"],["#e9dfcc","#f3a36b","#cd5b51","#554865","#352630"],["#dacdbd","#f2b8a0","#ef97a3","#df5c7e","#d4486f"],["#565175","#538a95","#67b79e","#ffb727","#e4491c"],["#260729","#2a2344","#495168","#ccbd9e","#d8ccb2"],["#aef055","#e0ffc3","#25e4bc","#3f8978","#514442"],["#444444","#fcf7d1","#a9a17a","#b52c00","#8c0005"],["#f7f799","#e0d124","#f0823f","#bd374c","#443a37"],["#288d85","#b9d9b4","#d18e8f","#b05574","#f0a991"],["#dbda97","#efae54","#ef6771","#4b1d37","#977e77"],["#002930","#ffffff","#f8f0af","#ac4a00","#000000"],["#184848","#006060","#007878","#a8c030","#f0f0d8"],["#b9113f","#a8636e","#97b59d","#cfcca8","#ffe3b3"],["#c8ce13","#f8f5c1","#349e97","#2c0d1a","#de1a72"],["#913f33","#ff705f","#ffaa67","#ffdfab","#9fb9c2"],["#fee9a6","#fec0ab","#fa5894","#660860","#9380b7"],["#ed7b83","#ec8a90","#eba2a4","#e6d1ca","#eee9c7"],["#fcfdeb","#e3cebd","#c1a2a0","#725b75","#322030"],["#e04891","#e1b7ed","#f5e1e2","#d1e389","#b9de51"],["#d3c8b4","#d4f1db","#eecab1","#fe6c63","#240910"],["#43777a","#442432","#c02948","#d95b45","#ecd079"],["#edeccf","#f1c694","#dc6378","#207178","#101652"],["#95de90","#cef781","#f7c081","#ff7857","#6b6b6b"],["#edd58f","#c2bf92","#66ac92","#686077","#641f5e"],["#f4f8e6","#f2e9e6","#4a3d3d","#ff6161","#d8dec3"],["#f9ebf2","#f3e2e8","#fcd7da","#f58f9a","#3c363b"],["#736558","#fd65a0","#fef5c6","#aaf2e4","#31d5de"],["#f9f6ec","#88a1a8","#502940","#790614","#0d0c0c"],["#affbff","#d2fdfe","#fefac2","#febf97","#fe6960"],["#ffffff","#a1ac88","#757575","#464d70","#000000"],["#f2502c","#cad17a","#fcf59b","#91c494","#c42311"],["#2e1e45","#612a52","#ba3259","#ff695c","#ccbca1"],["#910142","#6c043c","#210123","#fef7d5","#0ec0c1"],["#204b5e","#426b65","#baab6a","#fbea80","#fdfac7"],["#8dc9b5","#f6f4c2","#ffc391","#ff695c","#8c315d"],["#e3ba6a","#bfa374","#6d756a","#4d686f","#364461"],["#fffab3","#a2e5d2","#63b397","#9dab34","#2c2321"],["#f7f1e1","#ffdbd7","#ffb2c1","#ce7095","#855e6e"],["#f7dece","#eed7c5","#ccccbb","#9ec4bb","#2d2e2c"],["#4180ab","#ffffff","#8ab3cf","#bdd1de","#e4ebf0"],["#43204a","#7f1e47","#422343","#c22047","#ea284b"],["#686466","#839cb5","#96d7eb","#b1e1e9","#f2e4f9"],["#ff275e","#e6bc56","#7f440a","#6a9277","#f8d9bd"],["#50232e","#f77c3e","#faba66","#fce185","#a2cca5"],["#b2d9f7","#487aa1","#3d3c3b","#7c8071","#dde3ca"],["#9c8680","#eb5e7f","#f98f6f","#dbbf6b","#c8eb6a"],["#482c21","#a73e2b","#d07e0e","#e9deb0","#2f615e"],["#e4e6c3","#88baa3","#ba1e4a","#63203d","#361f2d"],["#f7f6e4","#e2d5c1","#5f3711","#f6f6e2","#d4c098"],["#ffab03","#fc7f03","#fc3903","#d1024e","#a6026c"],["#c72546","#66424c","#768a4f","#b3c262","#d5ca98"],["#c3dfd7","#c8dfd2","#cddfcd","#d2dfc8","#d7dfc3"],["#0db2ac","#f5dd7e","#fc8d4d","#fc694d","#faba32"],["#e8de92","#810e0b","#febea3","#fce5b1","#f6f5da"],["#63594d","#b18272","#c2b291","#d6e4c3","#eae3d1"],["#dae2cb","#96c3a6","#6cb6a5","#221d34","#90425c"],["#917f6e","#efbc98","#efd2be","#efe1d1","#d9ddcd"],["#3f324d","#93c2b1","#ffeacc","#ff995e","#de1d6a"],["#f3d915","#e9e4bb","#bfd4b7","#a89907","#1a1c27"],["#042608","#2a5c0b","#808f12","#faedd9","#ea2a15"],["#dadad8","#fe6196","#ff2c69","#1ea49d","#cbe65b"],["#454545","#743455","#a22365","#d11174","#ff0084"],["#8c0e48","#80ab99","#e8dbad","#b39e58","#99822d"],["#796c86","#74aa9b","#91c68d","#ece488","#f6f5cd"],["#678d6c","#fc7d23","#fa3c08","#bd0a41","#772a53"],["#dbf73b","#c0cc39","#eb0258","#a6033f","#2b2628"],["#ffc2ce","#80b3ff","#fd6e8a","#a2122f","#693726"],["#ab505e","#d9a071","#cfc88f","#a5b090","#607873"],["#f9d423","#ede574","#e1f5c4","#add6bc","#79b7b4"],["#172c3c","#274862","#995052","#d96831","#e6b33d"],["#f8f69f","#bab986","#7c7b6c","#3e3e53","#000039"],["#f1ebeb","#eee8e8","#cacaca","#24c0eb","#5cceee"],["#e6e8e3","#d7dacf","#bec3bc","#8f9a9c","#65727a"],["#fffbf0","#968f4b","#7a6248","#ab9597","#030506"],["#efac41","#de8531","#b32900","#6c1305","#330a04"],["#72bca5","#f4ddb4","#f1ae2b","#bc0b27","#4a2512"],["#ebf2f2","#d0f2e7","#bcebdf","#ade0db","#d9dbdb"],["#f4e196","#a6bf91","#5f9982","#78576b","#400428"],["#615050","#776a6a","#ad9a6f","#f5f1e8","#fcfcfc"],["#b9340b","#cea45c","#c5be8b","#498379","#3f261c"],["#ddcaa2","#aebea3","#b97479","#d83957","#4e5c69"],["#141827","#62455b","#736681","#c1d9d0","#fffae3"],["#2f3559","#9a5071","#e394a7","#f1bbbb","#e6d8cb"],["#b877a8","#b8008a","#ff3366","#ffcc33","#ccff33"],["#171133","#581e44","#c5485a","#d4be99","#e0ffcc"],["#ff0f35","#f86254","#fea189","#f3d5a5","#bab997"],["#cfb698","#ff5d57","#dd0b64","#6f0550","#401c2a"],["#d1dbc8","#b8c2a0","#c97c7a","#da3754","#1f1106"],["#2b9eb3","#85cc9c","#bcd9a0","#edf79e","#fafad7"],["#f26b7a","#f0f2dc","#d9eb52","#8ac7de","#87796f"],["#bdbf90","#35352b","#e7e9c4","#ec6c2b","#feae4b"],["#eeccbb","#f1731f","#e03e36","#bd0d59","#730662"],["#ebe5b2","#f6f3c2","#f7c69f","#f89b7e","#b5a28b"],["#20130a","#142026","#123142","#3b657a","#e9f0c9"],["#9d9f89","#84af97","#8bc59b","#b2de93","#ccee8d"],["#ff9934","#ffc018","#f8fef4","#cde54e","#b3c631"],["#bda0a2","#ffe6db","#d1eaee","#cbc8b5","#efb0a9"],["#31827c","#95c68f","#f7e9aa","#fc8a80","#fd4e6d"],["#4d433d","#525c5a","#56877d","#8ccc81","#bade57"],["#6a3d5a","#66666e","#6d8d76","#b0c65a","#ebf74f"],["#353437","#53576b","#7a7b7c","#a39b7e","#e2c99f"],["#ff9966","#d99973","#b39980","#8c998c","#669999"],["#d1dab9","#92bea5","#6f646c","#671045","#31233e"],["#839074","#939e78","#a8a878","#061013","#cdcd76"],["#52423c","#ad5c70","#d3ad98","#edd4be","#b9c3c4"],["#ffcfad","#ffe4b8","#e6d1b1","#b8aa95","#5e5a54"],["#eb9d8d","#93865a","#a8bb9a","#c5cba6","#efd8a9"],["#a8c078","#a89048","#a84818","#61290e","#330c0c"],["#27081d","#47232c","#66997b","#a4ca8b","#d2e7aa"],["#ffe7bf","#ffc978","#c9c987","#d1a664","#c27b57"],["#000000","#ed0b65","#b2a700","#fcae11","#770493"],["#031c30","#5a3546","#b5485f","#fc6747","#fa8d3b"],["#a22c27","#4f2621","#9f8241","#ebd592","#929867"],["#8fc9b9","#d8d9c0","#d18e8f","#ab5c72","#91334f"],["#302727","#ba2d2d","#f2511b","#f2861b","#c7c730"],["#f9ded3","#fdd1b6","#fab4b6","#c7b6be","#89abb4"],["#7375a5","#21a3a3","#13c8b5","#6cf3d5","#2b364a"],["#820081","#fe59c2","#fe40b9","#fe1cac","#390039"],["#262525","#525252","#e6ddbc","#822626","#690202"],["#f3214e","#cf023b","#000000","#f4a854","#fff8bc"],["#482344","#2b5166","#429867","#fab243","#e02130"],["#a9b79e","#e8ddbd","#dba887","#c25848","#9d1d36"],["#6e9167","#ffdd8c","#ff8030","#cc4e00","#700808"],["#ff3366","#e64066","#cc4d66","#b35966","#996666"],["#331436","#7a1745","#cb4f57","#eb9961","#fcf4b6"],["#ec4b59","#9a2848","#130716","#fc8c77","#f8dfbd"],["#1f0b0c","#e7fccf","#d6c396","#b3544f","#300511"],["#f3dcb2","#facb97","#f59982","#ed616f","#f2116c"],["#f7ead9","#e1d2a9","#88b499","#619885","#67594e"],["#adeada","#bdeadb","#cdeadc","#ddeadd","#edeade"],["#666666","#abdb25","#999999","#ffffff","#cccccc"],["#210518","#3d1c33","#5e4b55","#7c917f","#93bd9a"],["#fdbf5c","#f69a0b","#d43a00","#9b0800","#1d2440"],["#fdf4b0","#a4dcb9","#5bcebf","#32b9be","#2e97b7"],["#8ba6ac","#d7d7b8","#e5e6c9","#f8f8ec","#bdcdd0"],["#295264","#fad9a6","#bd2f28","#89373d","#142433"],["#ecf8d4","#e0deab","#cb8e5f","#85685a","#0d0502"],["#a2c7bb","#dde29f","#ac8d49","#ac0d0d","#320606"],["#ff667c","#fbbaa4","#f9e5c0","#2c171c","#b6d0a0"],["#4b4b55","#f4324a","#ff516c","#fb9c5a","#fcc755"],["#ffad08","#edd75a","#73b06f","#0c8f8f","#405059"],["#a8ab84","#000000","#c6c99d","#0c0d05","#e7ebb0"],["#332e1d","#5ac7aa","#9adcb9","#fafcd3","#efeba9"],["#d45e80","#c6838c","#cfbf9e","#f7dea8","#f6be5f"],["#fce7d2","#e0dbbd","#c0ceaa","#fd8086","#eb5874"],["#fcf3e3","#ed4c87","#63526e","#6cbaa4","#f2ad5e"],["#d6d578","#b1bf63","#9dad42","#258a60","#0a3740"],["#d1f7ba","#dbdea6","#d1bd95","#8c686b","#391b4a"],["#e1e6e3","#bfd6c7","#c7bd93","#ff7876","#574b45"],["#abece4","#c4d004","#ff9f15","#fb7991","#926d40"],["#ffffff","#ff97ca","#ff348e","#be0049","#770021"],["#fb6f24","#8ca315","#5191c1","#1e6495","#0a4b75"],["#dfd0af","#e8acac","#a45785","#85586c","#a1c0a1"],["#470d3b","#7e2f56","#c0576f","#e48679","#febd84"],["#940533","#c0012a","#f5061d","#ff8800","#ffb300"],["#0c0636","#095169","#059b9a","#53ba83","#9fd86b"],["#de4c45","#d9764d","#cc9e8a","#c1c5c7","#ebdfc6"],["#d24d6c","#ad8484","#d9d5bb","#c1858f","#b05574"],["#a6988a","#88a19f","#6aabb5","#4bb4ca","#1ec3ea"],["#7f135f","#a0667a","#c2b895","#c4cab0","#c7dcca"],["#d9d9db","#b7ae8f","#978f84","#4a362f","#121210"],["#e9d7a9","#d2d09f","#d5a57f","#b56a65","#4b3132"],["#99cccc","#a8bdc2","#b8aeb8","#c79ead","#d78fa3"],["#060212","#fe5412","#fc1a1a","#795c06","#4f504f"],["#c3b68c","#6e5b54","#b94866","#afb7a0","#f4eed4"],["#5d917d","#fff9de","#cdd071","#b81c48","#632739"],["#fef0a5","#f8d28b","#e3b18b","#a78d9e","#74819d"],["#fcd8af","#fec49b","#fe9b91","#fd6084","#045071"],["#3c515d","#3d6868","#40957f","#a7c686","#fcee8c"],["#b7aea5","#f77014","#e33c08","#433d3d","#221d21"],["#2c2b4b","#a75293","#9c7a9d","#9ddacb","#f8dcb4"],["#edf3c5","#f2cc49","#b7be5f","#24b399","#2d1c28"],["#200e38","#6a0e47","#b50d57","#ff0d66","#dec790"],["#ebebab","#78bd91","#4d8f81","#9b4b54","#f22b56"],["#27191c","#2d3839","#114d4d","#6e9987","#e0e4ce"],["#f4fce2","#d3ebc7","#aabfaa","#bf9692","#fc0284"],["#941f1f","#ce6b5d","#ffefb9","#7b9971","#34502b"],["#0ccaba","#e3f5b7","#e6ae00","#d46700","#9e3f00"],["#ff7a24","#ff6d54","#f76d75","#e8728f","#c97ba5"],["#fcf6d2","#fcf6d2","#fbe2b9","#c6c39a","#281f20"],["#fcf9ce","#c4e0a6","#dea37a","#bd3737","#d54c4a"],["#f8db7e","#ec6349","#ce2340","#6f1b2c","#310a26"],["#b6d9c3","#c6a9ac","#d48299","#e64e81","#fd0a60"],["#95aa61","#121310","#f6f8ee","#d6e68a","#899752"],["#3f264d","#5d2747","#9f3647","#db4648","#fb9553"],["#f9f9e7","#505045","#161613","#c0a1ae","#c1e0e0"],["#689195","#050000","#ab8288","#cea4a6","#ffcdc5"],["#ffe6bd","#ffcc7a","#e68a6c","#8a2f62","#260016"],["#cad5ad","#f9df94","#f6a570","#e77a77","#54343f"],["#73c5aa","#c6c085","#f9a177","#f76157","#4c1b05"],["#cf3a69","#8f4254","#7caa96","#b6c474","#d4d489"],["#d46419","#b34212","#341405","#166665","#83870e"],["#1f2f3a","#98092b","#df931b","#e0daa3","#9fb982"],["#7e949e","#aec2ab","#ebcea0","#fc7765","#ff335f"],["#807070","#9a8fc8","#8dbdeb","#a5e6c8","#d9f5b5"],["#1a2b2b","#332222","#4d1a1a","#661111","#800909"],["#8d1042","#a25d47","#a08447","#97aa66","#b8b884"],["#f7f0ba","#e0dba4","#a9cba6","#7ebea3","#53a08e"],["#551bb3","#268fbe","#2cb8b2","#3ddb8f","#a9f04d"],["#0f132e","#19274e","#536d88","#b49b85","#eac195"],["#1c0b2b","#301c41","#413b6b","#5c65c0","#6f95ff"],["#0d0210","#4d3147","#866a80","#c9b7c7","#fffbff"],["#fffff7","#e9fccf","#d8fcb3","#b1fcb3","#89fcb3"],["#efece2","#81d7cd","#ff0048","#b13756","#5b1023"],["#020202","#493d3f","#bdb495","#f8f2ce","#d8d989"],["#d8f5d1","#9ddbca","#92b395","#726c81","#565164"],["#5a3938","#847b6d","#a3ab98","#d2d5af","#dfa49b"],["#88d1ca","#ded6c9","#e68a2e","#c90a00","#452b34"],["#bfe4cd","#ddb37d","#fa8331","#fb4848","#fd0a60"],["#e85a50","#feffd6","#5bb7b6","#010002","#fdf37a"],["#4a3333","#e1473f","#9a9088","#80b0ab","#dbd1b3"],["#f6eddc","#e3e5d7","#bdd6d2","#a5c8ca","#586875"],["#b68810","#301406","#7f9473","#d3c795","#c02c20"],["#423431","#f70b17","#050000","#9a8c29","#e7cba4"],["#eec77a","#e77155","#c71755","#7b3336","#5b9b9a"],["#404467","#5c627a","#a3b6a2","#b2ccaf","#fffaac"],["#939473","#4f784e","#2d5e4c","#13444d","#252326"],["#16c1c8","#49cccc","#7cd7cf","#aee1d3","#e1ecd6"],["#ef4335","#f68b36","#f2cd4f","#cae081","#88eed0"],["#524e4e","#ff2b73","#ff5a6a","#ff9563","#ffcd37"],["#d94052","#ee7e4c","#ead56c","#94c5a5","#898b75"],["#0f7d7e","#76b5a0","#fffdd1","#ff7575","#d33649"],["#3e3742","#825e65","#cc8383","#ebc4a9","#e6e0c5"],["#d0dccb","#d7c7be","#b3c5ba","#88c3b5","#6d6168"],["#f7f4e8","#daf3ea","#85e6c0","#6bb39b","#0b0b0d"],["#04394e","#00875e","#a7cc15","#f5cc17","#f56217"],["#2f1335","#620e5d","#9d007a","#ce3762","#ff6e49"],["#220114","#811628","#bd3038","#ff7e57","#f8b068"],["#fb545c","#99662d","#b7e1a1","#cdeda1","#fdf5a4"],["#33242b","#e30842","#fc4630","#ff9317","#c4ff0d"],["#f5c8bf","#e0d2c5","#cad9ca","#a7e3c1","#495453"],["#f0f0d8","#d8d8c0","#7a8370","#df8615","#f84600"],["#9e9e9e","#5ecde0","#00fff2","#c4ffc9","#e0e0e0"],["#541e35","#df5d2e","#ffb43e","#a4c972","#6bb38e"],["#58534c","#f1d3ab","#dbce79","#f95842","#0eaeab"],["#f6b149","#f8572d","#df2a33","#a22543","#6b312d"],["#ffffff","#000000","#ff006f","#ffb300","#fff538"],["#f5ea95","#fc8e5b","#fc5956","#c93e4f","#3d1734"],["#f1ffd5","#d6e6b7","#a35481","#b8136f","#ea0063"],["#cb6f84","#291d21","#5d544d","#cfccbb","#e1daca"],["#ff8d7b","#c88984","#947280","#d6b58c","#dcd392"],["#ffeec2","#fe9e8e","#f80174","#c4037a","#322c8e"],["#75727a","#997f87","#b88c87","#d39679","#f3a76d"],["#e0dcb8","#c4bc16","#918f61","#c21f40","#302c25"],["#3b3e37","#e19563","#9fb39b","#d39088","#f0ddb5"],["#22806b","#a89f1d","#facb4b","#fcaf14","#ed7615"],["#281b24","#d02941","#f57e67","#d9c9a5","#8cab94"],["#555231","#9c8c51","#bcac71","#e9db9c","#79927d"],["#d3dbd9","#a4bdbc","#ffdabf","#ffbf91","#ff9a52"],["#79aba2","#b4b943","#b7833a","#a04b26","#301e1a"],["#ebe7a7","#a7ebc9","#78b395","#917c67","#5e5953"],["#ff8591","#efaaa3","#8caaa2","#5a9b95","#44878f"],["#f5d393","#f39772","#eb6765","#261329","#1a0b2a"],["#e4f3d8","#afcacc","#ffa02e","#e80560","#331d4a"],["#af0745","#fa4069","#fe9c6b","#fcda90","#c8b080"],["#c39738","#ffff96","#7f4311","#5e4318","#361f00"],["#582770","#773d94","#943d8a","#c22760","#e81764"],["#281916","#e86786","#f4a1b5","#ffd2cb","#96b5ad"],["#d2d2d2","#58afb8","#269199","#ec225e","#020305"],["#81749c","#4d3e6b","#8daec3","#c5dfe0","#fcfce2"],["#b19676","#766862","#92bf9f","#e3d49c","#f9f0b7"],["#cbdad5","#89a7b1","#566981","#3a415a","#34344e"],["#001f21","#029b99","#ebe7b7","#de4f15","#ecc039"],["#fb6a3d","#fbe5ac","#361d20","#a2bc97","#f7cd67"],["#907071","#7bbda1","#a4d9a3","#c6d7a0","#fbdcb0"],["#8e3f65","#73738d","#72a5ae","#98e9d0","#d8ffcc"],["#d2fae2","#e6f8b1","#f6d5ad","#f6b794","#e59da0"],["#ad2003","#e0e6ae","#bdd3b6","#836868","#5f0609"],["#fe9600","#ffc501","#ffee4a","#77477e","#03001c"],["#5e3848","#666163","#a7b381","#cad197","#cde0bf"],["#2a1e1e","#503850","#aa6581","#f99fa9","#ffc5c1"],["#d1dc5a","#e0f7e0","#77f2de","#6ac5cb","#45444e"],["#400e28","#992f4d","#f25872","#f08e73","#e8b787"],["#741952","#fe3174","#f1c15d","#94bb68","#09a3ad"],["#942222","#bd3737","#d4cdad","#98c3a1","#25857d"],["#160d18","#23145b","#09456c","#026f6e","#1ca39e"],["#e5dac0","#bcb091","#9f7b51","#820d25","#4a0013"],["#cf0638","#fa6632","#fecd23","#0a996f","#0a6789"],["#ff4000","#ffefb5","#319190","#ffc803","#260d0d"],["#817a8a","#cdbbbb","#fcddc8","#fffeea","#efcaba"],["#c75f77","#fefab6","#77a493","#836177","#654b49"],["#cdb27b","#de7c04","#e4211b","#c00353","#5e2025"],["#2a0308","#924f1b","#e2ac3f","#f8ebbe","#7ba58d"],["#a2825c","#88d3ab","#f9fad2","#f5da7a","#ff985e"],["#9aedb5","#ab9a89","#a3606d","#4f2d4b","#291e40"],["#fe958f","#f3d7c2","#8bb6a3","#17a7a8","#122f51"],["#2f2e30","#e84b2c","#e6d839","#7cd164","#2eb8ac"],["#4acabb","#cbe5c0","#fcf9c2","#edc5bd","#84407b"],["#d6496c","#7db8a2","#d6dd90","#fffad3","#7e638c"],["#becec4","#688a7c","#9d7c5b","#e35241","#e49183"],["#281a1a","#4e2d28","#70454e","#ae736f","#dda8b0"],["#966c80","#96bda8","#bfd4ad","#f7d3a3","#eca36c"],["#fff4ce","#d0deb8","#ffa492","#ff7f81","#ff5c71"],["#420b58","#fc036c","#f1a20b","#8d9c09","#08807b"],["#4d4d4d","#637566","#a39c67","#d69e60","#ff704d"],["#cc8f60","#b7a075","#9eb48e","#8cc2a0","#77d4b6"],["#ec6363","#ec7963","#ecb163","#dfd487","#bdebca"],["#1c31a5","#101f78","#020f59","#010937","#000524"],["#3d2304","#7f6000","#deb069","#c41026","#3d0604"],["#efd8a4","#e8ae96","#e49d89","#e47f83","#a8c99e"],["#c0ffff","#60ecff","#fe5380","#ffbb5e","#fefefc"],["#c9ad9b","#ffbda1","#e05576","#703951","#452a37"],["#40122c","#656273","#59baa9","#d8f171","#fcffd9"],["#1a110e","#4e051c","#f7114b","#c4b432","#bcb7ab"],["#f5e1a4","#d9d593","#ee7f27","#bc162a","#302325"],["#f67968","#f67968","#f68c68","#f68c68","#f6a168"],["#8e978d","#97c4ad","#bfedbe","#e6fcd9","#cdf2d6"],["#fef1e0","#f6e6ce","#3b2e2a","#3f0632","#a47f1a"],["#2a8b8b","#75c58e","#bfff91","#dfe9a8","#ffd2bf"],["#96958a","#76877d","#88b8a9","#b2cbae","#dbddb4"],["#f0debb","#59a87d","#16453f","#091c1a","#541734"],["#8d9c9d","#e00b5b","#f5b04b","#fcdfbd","#45373e"],["#93ba85","#bda372","#f49859","#ff494b","#5e363f"],["#fff7bc","#fee78a","#f8a348","#e15244","#3a7b50"],["#eda08c","#876f55","#a19153","#b1b080","#b1ceaf"],["#c0b19e","#ffb48f","#f68b7b","#f6464a","#911440"],["#c92c2c","#cf6123","#f3c363","#f1e9bb","#5c483a"],["#faf4e0","#d2ff1f","#ffc300","#ff6a00","#3b0c2c"],["#ffffff","#5e9188","#3e5954","#253342","#232226"],["#110303","#c3062c","#ff194b","#8fa080","#708066"],["#b0da09","#f99400","#f00a5e","#b80090","#544f51"],["#eeaeaa","#daaeaa","#c6aeaa","#b2aeaa","#9eaeaa"],["#f2f2f2","#348e91","#1c5052","#213635","#0a0c0d"],["#282832","#77181e","#a92727","#c6d6d6","#dee7e7"],["#cde9ca","#ced89d","#dfba74","#e8a249","#575e55"],["#ffffc2","#f0ffc2","#e0ffc2","#d1ffc2","#c2ffc2"],["#615c5c","#e30075","#ff4a4a","#ffb319","#ebe8e8"],["#636363","#85827e","#d1b39f","#ffecd1","#ffd1b3"],["#ffffe5","#dffda7","#6ecf42","#31a252","#6b456c"],["#e0be7e","#e89d10","#db4b23","#382924","#136066"],["#670d0f","#f01945","#f36444","#ffce6f","#ffe3c9"],["#2f2c2b","#413726","#79451d","#d7621a","#fd8d32"],["#548c82","#d1ce95","#fcfade","#d55d63","#452d3d"],["#96b5a6","#fce1cb","#febeac","#4e383d","#d9434f"],["#2b2318","#524835","#56704b","#5d9e7e","#78b3a4"],["#becb7c","#84967e","#962c4c","#f05d67","#faa191"],["#d0d167","#fffcff","#e6dddc","#ff0c66","#969ba2"],["#2f003f","#be0001","#ff8006","#f3c75f","#e9cfaa"],["#b7b09e","#493443","#eb6077","#f0b49e","#f0e2be"],["#f7e6be","#e89a80","#a93545","#4d4143","#485755"],["#c3aaa5","#d76483","#ef9ca4","#ffc2bb","#f6e5cb"],["#010d23","#03223f","#038bbb","#fccb6f","#e19f41"],["#fb7968","#f9c593","#fafad4","#b0d1b2","#89b2a2"],["#3b5274","#9c667d","#ce938b","#e8cc9c","#e3e1b1"],["#d8c358","#6d0839","#d0e799","#25271e","#fbeff4"],["#d8d3ab","#b0b19f","#784d5f","#ba456a","#d04969"],["#89666d","#d2c29f","#e3a868","#f76f6d","#f2306d"],["#30182b","#f0f1bc","#60f0c0","#ff360e","#191f04"],["#4aedd7","#705647","#ed6d4a","#ffca64","#3fd97f"],["#330708","#e84624","#e87624","#e8a726","#e8d826"],["#f7c097","#829d74","#de3c2f","#eb5f07","#f18809"],["#f00065","#fa9f43","#f9fad2","#262324","#b3dbc8"],["#f46472","#f2ecc3","#fff9d8","#bed6ab","#999175"],["#c3d297","#ffffff","#c3b199","#3a2d19","#e8373e"],["#3b0503","#f67704","#f85313","#fedc57","#9ecfbc"],["#678c99","#b8c7cc","#fff1cf","#d6c292","#b59e67"],["#fdf2c5","#efe8b2","#c6d1a6","#82bfa0","#7a6f5d"],["#21203f","#fff1ce","#e7bfa5","#c5a898","#4b3c5d"],["#ef7270","#ee9f80","#f3ecbe","#cdaf7b","#59291b"],["#3a3232","#d83018","#f07848","#fdfcce","#c0d8d8"],["#352640","#92394b","#a9767a","#d1b4a2","#f1f2ce"],["#fcf7d7","#fea667","#ffe461","#c4c776","#f4d092"],["#07f9a2","#09c184","#0a8967","#0c5149","#0d192b"],["#aaaa91","#848478","#5e5e5e","#383845","#12122b"],["#fdec6f","#f2e9b0","#ecdfdb","#ede3fb","#fedfae"],["#829b86","#96b7a2","#a6aa56","#b4b969","#dfdb9c"],["#050003","#496940","#93842f","#ffa739","#fce07f"],["#7ebeb2","#d1f3db","#da9c3c","#bc1953","#7d144c"],["#6c788e","#a6aec1","#cfd5e1","#ededf2","#fcfdff"],["#471754","#991d5d","#f2445e","#f07951","#dec87a"],["#81657e","#3ea3af","#9fd9b3","#f0f6b9","#ff1d44"],["#f2ecdc","#574345","#e3dacb","#c5ffe5","#f5eed4"],["#e8608c","#71cbc4","#fff9f4","#cdd56e","#ffbd68"],["#382a2a","#ff3d3d","#ff9d7d","#e5ebbc","#8dc4b7"],["#d5d8c7","#d4d6ce","#d3d5d5","#d1d3dc","#d0d2e3"],["#622824","#2f0618","#412a9c","#1b66ff","#00cef5"],["#092b5a","#09738a","#78a890","#9ed1b7","#e7d9b4"],["#368986","#e79a32","#f84339","#d40f60","#005c81"],["#140d1a","#42142a","#ff2e5f","#ffd452","#faeeca"],["#dacdac","#f39708","#f85741","#0e9094","#1e1801"],["#a6e094","#e8e490","#f07360","#bf2a7f","#5c3d5b"],["#46294a","#ad4c6b","#e07767","#e0ae67","#d4e067"],["#10100f","#26503c","#849112","#9d4e0f","#840943"],["#ff9b8f","#ef7689","#9e6a90","#766788","#71556b"],["#2b2c30","#35313b","#453745","#613c4c","#ff1457"],["#edffb3","#99928e","#bfe3c3","#dbedc2","#fff2d4"],["#e1edd1","#aab69b","#9e906e","#b47941","#cf391d"],["#504375","#39324d","#ffe8ef","#c22557","#ed5887"],["#fffec7","#e1f5c4","#9dc9ac","#919167","#ff4e50"],["#e4ffd4","#ebe7a7","#edc68e","#a49e7e","#6e8f85"],["#3d0a49","#5015bd","#027fe9","#00caf8","#e0daf7"],["#a1a6aa","#bd928b","#de7571","#ff4e44","#282634"],["#f28a49","#f7e3b2","#e3967d","#57342d","#9dbfa4"],["#6ea49b","#d9d0ac","#6b8f0b","#7d3f60","#372b2e"],["#37ab98","#80bc96","#a6c88c","#e1ce8a","#37053b"],["#333237","#fb8351","#ffad64","#e9e2da","#add4d3"],["#d4cdc5","#5b88a5","#f4f4f2","#191013","#243a69"],["#24434b","#fc325b","#fa7f4b","#bfbc84","#63997a"],["#e5e6b8","#c6d4b8","#6ca6a3","#856a6a","#9c325c"],["#beed80","#59d999","#31ada1","#51647a","#453c5c"],["#3b331f","#ed6362","#ff8e65","#dceb5b","#58ce74"],["#d6ce8b","#8fd053","#02907d","#03453d","#2c1001"],["#402b30","#faddb4","#f4c790","#f2977e","#ba6868"],["#af162a","#95003a","#830024","#5a0e3d","#44021e"],["#e81e4a","#0b1d21","#078a85","#68baab","#edd5c5"],["#fb6066","#ffefc1","#fdd86e","#ffa463","#f66b40"],["#fa7785","#24211a","#d5d87d","#b1d4b6","#53cbbf"],["#9cd6c8","#f1ffcf","#f8df82","#fac055","#e57c3a"],["#3b4344","#51615b","#bbbd91","#f06f6b","#f12f5d"],["#b9030f","#9e0004","#70160e","#161917","#e1e3db"],["#f2e7d2","#f79eb1","#ae8fba","#4c5e91","#473469"],["#ff5252","#ff7752","#ff9a52","#ffb752","#5e405b"],["#c1ddc7","#f5e8c6","#bbcd77","#dc8051","#f4d279"],["#dfcccc","#ffd3d3","#ffa4a4","#d17878","#965959"],["#585d5d","#e06f72","#e7a17a","#e4b17d","#d1cbc0"],["#92b2a7","#6e7b8c","#b69198","#efa09b","#e7c7b0"],["#260d33","#003f69","#106b87","#157a8c","#b3aca4"],["#72bab0","#f0c69c","#d1284f","#9e0e30","#301a1a"],["#070705","#3e4b51","#6f737e","#89a09a","#c1c0ae"],["#4e3150","#c7777f","#b6dec1","#d6ecdf","#fbf6b5"],["#e4a691","#f7efd8","#c8c8a9","#556270","#273142"],["#e6626f","#efae78","#f5e19c","#a2ca8e","#66af91"],["#fbe4ae","#dacb8a","#897632","#392e0e","#6bb88a"],["#02fcf3","#a9e4cf","#cae0c8","#deddc4","#e8e7d2"],["#d0dcb3","#dabd90","#df7670","#f4065e","#837d72"],["#f5f5f5","#e9e9e9","#006666","#008584","#cccccc"],["#2eb3a1","#4fb37c","#79b36b","#a2ab5e","#bca95b"],["#594747","#6743a5","#7345d6","#2e2e2e","#bfab93"],["#efe2bf","#f5a489","#ef8184","#a76378","#a8c896"],["#4e031e","#5d2d4e","#5a4c6e","#447390","#05a1ad"],["#db3026","#e88a25","#f9e14b","#efed89","#7abf66"],["#f7f3cf","#c2e4cb","#36cecc","#27b1bf","#176585"],["#878286","#88b6a3","#bdba9e","#e2c18d","#e2bb64"],["#fe495f","#fe9d97","#fffec8","#d8fd94","#bded7e"],["#fab96b","#f19474","#ea777b","#94919a","#69a2a8"],["#322f3e","#e63c6d","#f5b494","#ede7a5","#abdecb"],["#c0b698","#647e37","#300013","#6e9a81","#d2c8a7"],["#259b9b","#6fbcaa","#b8d6b0","#feedbf","#ff1964"],["#17181f","#314d4a","#0b8770","#a6c288","#ebe68d"],["#e7ddd3","#c0c2bd","#9c9994","#29251c","#e6aa9f"],["#e72313","#fffcf7","#67b588","#65a675","#141325"],["#801245","#f4f4dd","#dcdbaf","#5d5c49","#3d3d34"],["#f8dac2","#f2a297","#f4436f","#ca1444","#142738"],["#61d4b0","#8ee696","#baf77c","#e8ff65","#ecedd5"],["#85b394","#a7ba59","#f0f0d8","#f0d890","#ae2f27"],["#a69a81","#e0d3b8","#eb9e6e","#eb6e6e","#706f6b"],["#edb886","#f1c691","#ffe498","#f9f9f1","#b9a58d"],["#87b091","#c4d4ab","#e0e0b6","#171430","#eff0d5"],["#3a3132","#0f4571","#386dbd","#009ddd","#05d3f8"],["#010300","#314c53","#5a7f78","#bbdec6","#f7f8fc"],["#02031a","#021b2b","#b10c43","#ff0841","#ebdfcc"],["#11091a","#2f2f4d","#626970","#bab195","#e8d18e"],["#463a2a","#5c4b37","#dddd92","#57c5c7","#00b5b9"],["#c9031a","#9d1722","#4a2723","#07a2a6","#ffeccb"],["#ff7c70","#f2dfb1","#b7c9a9","#674d69","#2e292e"],["#fff7e5","#fecdd0","#f8afb8","#f5a3af","#59483e"],["#5e0324","#692764","#7b7893","#7fb1a8","#94f9bf"],["#a9baae","#e6d0b1","#deb297","#c98d7b","#8a6662"],["#63072c","#910f43","#a65d53","#d59500","#f7f7a1"],["#fa3419","#f3e1b6","#7cbc9a","#23998e","#1d5e69"],["#6d165a","#a0346e","#ec5c8d","#ff8c91","#ffc4a6"],["#000000","#a69682","#7e9991","#737373","#d8770c"],["#decba0","#a0ab94","#6b9795","#594461","#6e1538"],["#240f03","#4b2409","#bd7a22","#e79022","#df621c"],["#a89d87","#bab100","#f91659","#b31d6a","#2e2444"],["#0e0036","#4c264b","#a04f62","#d2a391","#e6d7b8"],["#b9f8f0","#b6d3a5","#ee9b57","#ef2b41","#11130e"],["#1f0441","#fc1068","#fcab10","#f9ce07","#0ce3e8"],["#2a091c","#87758f","#85aab0","#a3c3b8","#e3edd2"],["#320139","#331b3b","#333e50","#5c6e6e","#f1debd"],["#211c33","#2b818c","#ffc994","#ed2860","#990069"],["#cc063e","#e83535","#fd9407","#e2d9c2","#10898b"],["#f75e50","#eac761","#e8df9c","#91c09e","#7d7769"],["#e5fec5","#c5fec6","#a3fec7","#29ffc9","#392a35"],["#e0eebd","#dae98a","#e17572","#ce1446","#2b0b16"],["#8fbfb9","#649ea7","#bddb88","#e0f3b2","#eefaa8"],["#06d9b6","#a4f479","#d4d323","#d13775","#9c3c86"],["#1a0c12","#f70a71","#ffdaa6","#ffb145","#74ab90"],["#648285","#b4a68e","#080d0d","#f3daaa","#a3c4c2"],["#a4f7d4","#9ae07d","#ada241","#a13866","#381c30"],["#fef7d5","#abee93","#2d938e","#0b4462","#f7a48b"],["#00686c","#32c2b9","#edecb3","#fad928","#ff9915"],["#cbe4ea","#ead1cb","#af9c98","#657275","#000000"],["#f3ffd2","#bff1ce","#82bda7","#6e837c","#2e0527"],["#484450","#466067","#459a96","#34baab","#c4c8c5"],["#fbffcc","#caf2be","#ddc996","#f67975","#f13565"],["#f5e3ae","#fff5d6","#e1e6d3","#b1ccc4","#4e5861"],["#e3604d","#d1c8a3","#acba9d","#7b5d5e","#c6ad71"],["#3b1a01","#a5cc7a","#dcffb6","#633b1c","#db3c6e"],["#000000","#7890a8","#304878","#181848","#f0a818"],["#ffe3b3","#ff9a52","#ff5252","#c91e5a","#3d2922"],["#bbaa9a","#849b95","#90856f","#b6554c","#d83a31"],["#e2e2b2","#49fecf","#370128","#e42355","#fe7945"],["#e4e2af","#ffa590","#e5cbb4","#fff1d7","#56413e"],["#f3b578","#f78376","#da4c66","#8f3c68","#3f3557"],["#f2ecb0","#ebb667","#d65c56","#823c3c","#1b1c26"],["#f1f7cd","#d3f7cd","#b5f7cd","#403a26","#81876c"],["#99db49","#069e8c","#211d19","#575048","#9e064a"],["#8f9044","#f8a523","#fc8020","#cf1500","#352f3d"],["#4b1623","#75233d","#c4594b","#f0b96b","#fdf57e"],["#7d677e","#4f2c4d","#360b41","#ccc9aa","#fafdea"],["#eed47f","#f2e0a0","#d8d8b2","#8cb0b0","#432332"],["#5c1b35","#d43f5d","#f2a772","#e8d890","#e2edb7"],["#40223c","#42988f","#b1c592","#f1ddba","#fb718a"],["#7e6762","#cf5a60","#f85a69","#f0b593","#e3dfbc"],["#300d28","#70615c","#8ca38b","#f7eeaa","#edb552"],["#caf729","#79dd7e","#2ecbaa","#21b6b6","#888dda"],["#f3ddb6","#d6bf93","#532728","#ced0ba","#f2efce"],["#412973","#753979","#b1476d","#eb9064","#bed9c8"],["#48586f","#ffffc0","#d6c496","#d62e2e","#283d3e"],["#68b2f8","#506ee5","#7037cd","#651f71","#1d0c20"],["#a7848b","#b88f93","#f5d5c6","#f9efd4","#b8cabe"],["#f9ebc4","#ffb391","#fc2f68","#472f5f","#08295e"],["#1f192f","#2d6073","#65b8a6","#b5e8c3","#f0f7da"],["#d3c6cc","#e2c3c6","#eecfc4","#f8e6c6","#ffffcc"],["#f8f8d6","#b3c67f","#5d7e62","#50595c","#fa3e3e"],["#723e4e","#b03851","#ef3353","#f17144","#f4b036"],["#c7003f","#f90050","#f96a00","#faab00","#daf204"],["#663333","#994d4d","#cc6666","#e6b280","#ffff99"],["#66ffff","#8cbfe6","#b380cc","#d940b3","#ff0099"],["#665c52","#74b3a7","#a3ccaf","#e6e1cf","#cc5b14"],["#53ac59","#3b8952","#0f684b","#03484c","#1c232e"],["#fea304","#909320","#125a44","#37192c","#220315"],["#c8cfae","#96b397","#525574","#5c3e62","#9b5f7b"],["#745e50","#ff948b","#fdaf8a","#fcd487","#f79585"],["#e4b302","#158fa2","#de4f3a","#722731","#bd1b43"],["#79d6b7","#ccd6bd","#d7c3ab","#f0afab","#f58696"],["#d3b390","#b8a38b","#a78b83","#c76b79","#f1416b"],["#f4fcb8","#dae681","#95a868","#452c18","#cc7254"],["#52493a","#7c8569","#a4ab80","#e8e0ae","#de733e"],["#111113","#d18681","#acbfb7","#f6ebdd","#8e6d86"],["#52baa7","#718f85","#ba5252","#fc0f52","#fc3d73"],["#edab8b","#f5ebb0","#dad061","#acc59d","#776c5a"],["#0b110d","#2c4d56","#c3aa72","#dc7612","#bd3200"],["#5a372c","#8b8b70","#98c7b0","#f0f0d8","#c94b0c"],["#ebe5ce","#ced1c0","#bad1c9","#8c162a","#660022"],["#090f13","#171f25","#752e2b","#c90a02","#f2eab7"],["#9ed99e","#f0dda6","#eb6427","#eb214e","#1a1623"],["#865a19","#c4b282","#85005b","#520647","#0e002f"],["#545454","#7b8a84","#8cbfaf","#ede7d5","#b7cc18"],["#fb573b","#4f393c","#8ea88d","#9cd0ac","#f4eb9e"],["#e5e5e5","#f1dbda","#fcd0cf","#cfbdbf","#a2a9af"],["#ffdeb3","#73bc91","#342220","#fc370c","#ff8716"],["#cccc66","#a6bf73","#80b380","#59a68c","#339999"],["#574d4f","#ffffff","#969091","#ffe999","#ffd952"],["#5f545c","#eb7072","#f5ba90","#f5e2b8","#a2caa5"],["#5e5473","#19b5a5","#ede89d","#ff6933","#ff0048"],["#edd8bb","#e2aa87","#fef7e1","#a2d3c7","#ef8e7d"],["#ceebd1","#b6deb9","#b1ccb4","#aebfaf","#a6ada7"],["#332d27","#8a0015","#e30224","#85725f","#fae1c0"],["#fdefb0","#e7a8b1","#b998b3","#77779d","#4771a3"],["#473334","#b3c8a7","#ffebb9","#e3536c","#da1a29"],["#fbb498","#f8c681","#bec47e","#9bb78f","#98908d"],["#dae5ab","#e9a385","#fa154b","#87313f","#604e48"],["#9d9382","#ffc1b2","#ffdbc8","#fff6c7","#dcd7c2"],["#cdb28a","#f9f4e3","#d4ddb1","#b1ba8e","#7a6448"],["#ff548f","#9061c2","#be80ff","#63d3ff","#02779e"],["#210210","#ee2853","#2b0215","#8f2f45","#d24d6c"],["#383939","#149c68","#38c958","#aee637","#fffedb"],["#bfe0c0","#160921","#f06e75","#f2af60","#d0d26f"],["#3b234a","#523961","#baafc4","#c3bbc9","#d4c7bf"],["#c95c7a","#de9153","#d6d644","#dcebaf","#14888b"],["#ffffea","#a795a5","#7a959e","#424e5e","#3b2b46"],["#addfd3","#eae3d0","#dbc4b6","#ffa5aa","#efd5c4"],["#f0c0a8","#f0d8a8","#a8c090","#789090","#787878"],["#f0f0f0","#d8d8d8","#c0c0a8","#604848","#484848"],["#000000","#1693a5","#d8d8c0","#f0f0d8","#ffffff"],["#ff1d44","#fbebaf","#74bf9d","#56a292","#1c8080"],["#ae0c3e","#afcca8","#f5eec3","#c7b299","#33211c"],["#ff8482","#ffb294","#f8d8a5","#91be95","#635a49"],["#000000","#8f1414","#e50e0e","#f3450f","#fcac03"],["#a88914","#91a566","#bed084","#e9e199","#faedca"],["#eddbc4","#a3c9a7","#ffb353","#ff6e4a","#5c5259"],["#413249","#ccc591","#e2b24c","#eb783f","#ff426a"],["#37193b","#e75a7a","#f59275","#f5c273","#aeb395"],["#880606","#d53d0c","#ff8207","#231d1e","#fcfcfc"],["#bad3c6","#f9d9ac","#fca483","#f18886","#7b7066"],["#e8d7a9","#8eaa94","#6b666d","#6c3751","#52223c"],["#e6e6e6","#aae6d9","#c8cbc1","#e6b0aa","#a1a1a1"],["#3b3f49","#fdfaeb","#faeddf","#f3c6b9","#f7a29e"],["#394736","#696b46","#b99555","#a8462d","#5c584c"],["#f23e02","#fef5c8","#00988d","#2c6b74","#013750"],["#f05c54","#a17457","#5c735e","#3d615b","#434247"],["#cce4d1","#d2e1a7","#d8de7d","#dedb53","#e4d829"],["#c5f7f0","#a9c2c9","#8e8ca3","#72577c","#562155"],["#fcbf6b","#a9ad94","#42302e","#f6daab","#dabd7b"],["#484848","#006465","#0f928c","#00c9d2","#beee3b"],["#e0da96","#badda3","#94e0b0","#a6b5ae","#b88bad"],["#e1c78c","#eda011","#db6516","#7a6949","#adad8e"],["#eb445b","#f5938b","#f0cdab","#f1e7c5","#b6d4bb"],["#c0d88c","#f7a472","#f07877","#fa2a3a","#0a5c5a"],["#d0cf75","#f8764e","#da2644","#90044a","#440a2a"],["#e6546b","#da8f72","#ffe792","#c9daa4","#8acbb5"],["#f8f4c4","#d5e0b5","#a5c3a7","#6d8b89","#47667b"],["#3e3433","#f07f83","#b29a78","#9eaf83","#75a480"],["#c5b89f","#feffd4","#9e2d4a","#450b1e","#21000f"],["#5e1f28","#8a2f2e","#ae5543","#f7bb75","#83764c"],["#eb7f7f","#eb9a7f","#ebb57f","#ebd07f","#ebeb7f"],["#fcbf6b","#e58634","#657a38","#afab50","#a9ccb9"],["#cee1d8","#f6eee0","#fda664","#f04842","#83563f"],["#e0d1ed","#f0b9cf","#e63c80","#c70452","#4b004c"],["#680a1d","#3f1719","#fcef9c","#e8b666","#ba2339"],["#343635","#d90057","#e88700","#77b8a6","#ffe2ba"],["#185b63","#c0261c","#ba460d","#c59538","#404040"],["#cb7ca2","#ed9da1","#c9e5af","#dceeb1","#fef9f6"],["#0d0f36","#294380","#69d2cd","#b9f1d6","#f1f6ce"],["#c9b8a8","#f8af8c","#a24d52","#5a3044","#391d34"],["#faefc2","#a4ac9d","#a27879","#a4626c","#f05d77"],["#5b1d99","#0074b4","#00b34c","#ffd41f","#fc6e3d"],["#079ea6","#1e0c42","#f0077b","#f5be58","#e3e0b3"],["#e46d29","#ba4c57","#4e3a3b","#a59571","#d0bc87"],["#f2eabc","#54736e","#194756","#080000","#ff3b58"],["#e2d9db","#f2e5f9","#d9e1df","#ff8a84","#fe6763"],["#f3d597","#b6d89c","#92ccb6","#f87887","#9e6b7c"],["#e6ac84","#ad9978","#619177","#161618","#594c2a"],["#eee5d6","#8f0006","#000000","#939185","#98a5ad"],["#bf9f88","#e8c8a1","#fce4be","#f6a68d","#f96153"],["#ffbd87","#ffd791","#f7e8a6","#d9e8ae","#bfe3c0"],["#e4e6c9","#e6dac6","#d6c3b9","#c2b48a","#b37883"],["#2b2823","#8fa691","#d4ceaa","#f9fadc","#cc3917"],["#e84d5b","#eae2cf","#b4ccb9","#26979f","#3b3b3b"],["#4d4250","#b66e6f","#cf8884","#e6a972","#f6d169"],["#11665f","#599476","#e4d673","#eb624f","#ac151c"],["#5c4152","#b4585d","#d97f76","#f7d0a9","#a1c0ae"],["#58706d","#4b5757","#7c8a6e","#b0b087","#e3e3d1"],["#f4e1b8","#9ec7b7","#acaa9b","#a5826e","#7e514b"],["#ede5ce","#fdf6e6","#ffe2ba","#f4b58a","#f7a168"],["#ff2121","#fd9a42","#c2fc63","#bcf7ef","#d7eefa"],["#806835","#f7f1cd","#6b9e8b","#a62121","#130d0d"],["#d9d766","#c5c376","#a48b86","#84567a","#643263"],["#6c3948","#ba5f6e","#cc8c82","#ded787","#f9eabf"],["#855f30","#9ec89a","#eaba68","#ff5248","#f6ffb3"],["#d3f7e9","#fcf3d2","#fbcf86","#fa7f46","#dd4538"],["#c3e6d4","#f4f0e5","#e0c4ae","#e1918e","#e15e6e"],["#d92d7a","#cd4472","#c25c6a","#b77463","#ac8c5e"]];
	},
	
	_activePallet : function(p){
		var activeColorPalletsSlots = ''; 
		for(var i = 0 ; i < p.length ; i++){
			var cn = p[i] ;
			activeColorPalletsSlots += '<ul>';
			for(var k = 0 ; k < 5 ; k++){
				if(k == 0){
					activeColorPalletsSlots += '<li data-color="'+this._shadeColor(cn, 60)+'" style="background:'+this._shadeColor(cn, 60)+'"></li>';
				}else if(k == 1){
					activeColorPalletsSlots += '<li data-color="'+this._shadeColor(cn, 30)+'" style="background:'+this._shadeColor(cn, 30)+'"></li>';
				}else if(k == 2){
					activeColorPalletsSlots += '<li data-color="'+cn+'" style="background:'+cn+'"></li>';
				}else if(k == 3){
					activeColorPalletsSlots += '<li data-color="'+this._shadeColor(cn, -30)+'" style="background:'+this._shadeColor(cn, -30)+'"></li>';
				}else if(k == 4){
					activeColorPalletsSlots += '<li data-color="'+this._shadeColor(cn, -60)+'" style="background:'+this._shadeColor(cn, -60)+'"></li>';
				}
			}
			activeColorPalletsSlots += '</ul>';
		}
		return activeColorPalletsSlots ;
	},
	_hexToRgbA : function (hex){
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return [(c>>16)&255, (c>>8)&255, c&255].join(',');
		}
		//throw new Error('Bad Hex');
	},
	_rgb2hex : function (rgb){
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	},
	_shadeColor : function (color, percent) {
		var R = parseInt(color.substring(1,3),16);
		var G = parseInt(color.substring(3,5),16);
		var B = parseInt(color.substring(5,7),16);

		R = parseInt(R * (100 + percent) / 100);
		G = parseInt(G * (100 + percent) / 100);
		B = parseInt(B * (100 + percent) / 100);

		R = (R<255)?R:255;  
		G = (G<255)?G:255;  
		B = (B<255)?B:255;  

		var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
		var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
		var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

		return "#"+RR+GG+BB;
	},
	_rand : function (len) {
		var x = 10;
		if(len){ x = len; }
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < x; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
});