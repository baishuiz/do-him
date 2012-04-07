
var Person=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

Person.prototype={

	constructor : Person ,

	id : null,
	name : null,
	x : 0,
	y : 0,
	
	rotation : 0,
	rotationD : 0,
	
	speed : 3,
	speedR : 6,

	baseX : 25,
	baseY : 40,
	walk : false ,

	bodyBox : null,
	AABB : null,

	view : null ,

	mapX : 0,
	mapY : 0,

	img : null ,

	state : 0 ,

	imgWidth : 48 ,
	imgHeight : 80 ,

	weaponImgWidth : 56 ,
	weaponImgHeight : 24 ,

	power : 100 ,
	powerSpeed : 0.4,


	init : function(){

		this.bodyBox=[
			[],
			[],
			[],
			[]

		],

		this.view=new ViewField({
			person : this
		});

		this.view.init();
		this.AABB=[];

		this.updateAABB();

	},

	setPos : function(){

	},
	setRotation : function(rotation){
		this.rotationD=rotation;

	},
	rage : function(){
		if (this.power==100 && this.state!=1){
			this.state=1;
		}
	},

	update : function(deltaTime ){

		if (this.state==1){
			this.power-=this.powerSpeed;
			if (this.power<=0){
				this.power=0;
				this.state=0;
			}
		}else{
			if (this.power<100){
				this.power+=this.powerSpeed;
			}else{
				this.power=100;
			}
		}

		if (!this.walk){
			return
		}

		var speedR=this.speedR*(this.state==1?1.8:1);
		var speed=this.speed*(this.state==1?1.8:1);

		this.rotation=(this.rotation+360)%360;
		this.rotationD=(this.rotationD+360)%360;

		var deltaR=0;
		var dr=this.rotationD-this.rotation;

		if (Math.abs(dr)<=speedR || Math.abs(dr)>=360-speedR){
			this.rotation=this.rotationD;
			this.view.rotate(dr);
		}else{
			
			if (0<dr && dr<180){
				deltaR=speedR;
			}else if( 180<=dr && dr<360){
				deltaR=-speedR;
			}else if ( -180<dr && dr<0 ){
				deltaR=-speedR;
			}else if( -360<dr && dr<=-180){
				deltaR=speedR;
			}
			this.rotation+=deltaR;
			this.view.rotate(deltaR);
		}

		var rad=this.rotationD*DH.CONST.DEG_TO_RAD;
		var speedX=speed*Math.cos(rad);
		var speedY=speed*Math.sin(rad);

		if (speedX ||speedY) {
			this.x+=speedX;
			this.y+=speedY;
			this.view.move(speedX,speedY);
		}

		this.updateAABB();



	},

	getAABB : function(){
		return this.AABB;
	},

	inAABB : function(x,y){
		// var x=sprite.x , y=sprite.y;
		var aabb=this.AABB;
		return x>aabb[0] && y>aabb[1] && x<aabb[2] && y<aabb[3] ;
	},

	updateAABB : function(){

		var poly=this.view.poly;
		var minX=Math.min( poly[0][0],poly[1][0],poly[2][0]);
		var maxX=Math.max( poly[0][0],poly[1][0],poly[2][0]);

		var minY=Math.min( poly[0][1],poly[1][1],poly[2][1]);
		var maxY=Math.max( poly[0][1],poly[1][1],poly[2][1]);

		var aabb=this.AABB;

		var ext=80;

		aabb[0]=minX-ext;
		aabb[1]=minY-ext;
		aabb[2]=maxX+ext;
		aabb[3]=maxY+ext;

	},

	render : function(context){
		
		context.save();

		var x=this.x-this.mapX;
		var y=this.y-this.mapY;

		context.translate( x , y );
		context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

		context.translate( -this.baseX , -this.baseY );

		this.renderWeapon(context);

		context.drawImage(this.img, 0,0, this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				

		context.restore();

		var x=this.AABB[0]-this.mapX;
		var y=this.AABB[1]-this.mapY;
		var w=this.AABB[2]-this.AABB[0];
		var h=this.AABB[3]-this.AABB[1];
		context.strokeRect(x,y,w,h);

		// this.power
		context.fillStyle=this.state==1?"red":(this.power==100?"blue":"green");
		context.fillRect(500,50, this.power, 10);
	},

	renderWeapon : function(context){

		if (this.state==1){
			var ox=35, oy=30;
			context.translate( ox , oy );
			context.drawImage(this.img, this.imgWidth,0, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

	}

}

var PersonShare=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

PersonShare.prototype={

	constructor : PersonShare ,
	id : null ,
	x : 0,
	y : 0,
	rotation : 0,
	state : 0 ,


	img : null,
	baseX : 0,
	baseY : 0,

	imgWidth : 48 ,
	imgHeight : 80 ,

	weaponImgWidth : 56 ,
	weaponImgHeight : 24 ,


	mapX : 0,
	mapY : 0,


	render : function(context){
		
		context.save();

		var x=this.x-this.mapX;
		var y=this.y-this.mapY;

		context.translate( x , y );
		context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

		context.translate( -this.baseX , -this.baseY );

		if (this.state==1){
			var ox=35, oy=30;
			context.translate( ox , oy );
			context.drawImage(this.img, this.imgWidth,0, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

		context.drawImage(this.img, 0,0, this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				

		context.restore();

	}

}

exports.Person=Person;
exports.PersonShare=PersonShare;



