class Person extends egret.DisplayObjectContainer{
      public _person:egret.Bitmap=new egret.Bitmap();
      private _State:State;
      
      public constructor() {
        super();
      }
      public SetState(e:State){
          if(this._State!=e){
              this._State.onExit();
          }
          this._State=e;
          this._State.onEnter();
        }
      public firstCreat(){
        this._person=this.createBitmapByName("10000_png")
        this._person.x=0;
        this._person.y=0;
        this.setAnchor(this._person);
 
        this.addChild(this._person);
        var idle:Idle=new Idle (this);
        var walk:Walk=new Walk(this);
        this._State=idle;
        idle.onEnter();
      }
      public Creat(){
        var walk:Walk=new Walk(this);
        var idle:Idle=new Idle (this);
        var x:number;
        var y:number;
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,(evt:egret.TouchEvent)=>{
            if(this._State==walk)
            {
                console.log("          "+this._State);
                egret.Tween.removeTweens(this._person);
                egret.Tween.get(this._person).to({x:evt.stageX,y:evt.stageY},2000, egret.Ease.sineIn );
            }else{
                 this.SetState(walk);
                 egret.Tween.get(this._person).to({x:evt.stageX,y:evt.stageY},2000, egret.Ease.sineIn );
            }
            x=evt.stageX;
            y=evt.stageY;
        },this);
        egret.startTick(():boolean=>{
        if(this._person.x==x && this._person.y==y){
                this.SetState(idle);
        }
        return false;
        },this);

      }
      public createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
      }
      private setAnchor(e:egret.Bitmap)
      {
         e.$setAnchorOffsetX(e.width/2);
         e.$setAnchorOffsetY(e.height/2);
      }

}