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

interface State {

      onEnter();
      
      onExit();
  }
class Idle implements State{
        public constructor(pperson:Person) {
            this.person=pperson;
        }
        private person:Person=new Person();;
        private Idlelist=["Idle0_png","Idle1_png","Idle2_png","Idle3_png"];
        private count:number=-1;
        private i:number=0;

        onEnter(){
            egret.startTick(this.PlayIdle,this);
        }

        onExit(){
            egret.stopTick(this.PlayIdle,this);
            console.log("IdleExit");
        }

        private PlayIdle():boolean{
          this.count++;
          this.i++;
          if(this.count>=this.Idlelist.length)
              this.count=0;
          //var na=(i+10000).toString()+"_png";
          //console.log("Idle");
          if(this.i==10){
             this.person._person.texture=RES.getRes(this.Idlelist[this.count]);
             this.i=0;
          }
          return false;
        }
}
class Walk implements State{
          private Walklist=["10000_png","10001_png","10002_png","10003_png","10004_png","10005_png","10006_png","10007_png"];
          private Walkcount=-1;
          private person:Person=new Person();
          private i:number=0;
          public constructor(pperson:Person) {
             this.person=pperson;
          }
          onEnter(){
                egret.startTick(this.PlayWalk,this);
                     console.log("EnterWalk");
          }

          onExit(){
                egret.stopTick(this.PlayWalk,this);
          }
          private PlayWalk():boolean{
                this.Walkcount++;
                this.i++;
                if(this.Walkcount>=this.Walklist.length)
                    this.Walkcount=0;
                if(this.i==10){
                    this.person._person.texture=RES.getRes(this.Walklist[this.Walkcount]);
                    this.i=0;
                }
                //  console.log("Walk");
                //  console.log(this.Walklist[this.Walkcount]);
                  return false;
          }
}