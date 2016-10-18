class Person extends egret.DisplayObjectContainer{
      public _person:egret.Bitmap;
      //private stata:PersonState=new PersonState();
      private _State:State;
      public constructor() {
        super();
      }
      public SetState(e:State){
          if(this._State){
              this._State.onExit();
          }
          e=this._State;
          this._State.onEnter();
        }
      public Creat(){
        this._person=this.createBitmapByName("10000_png")
        this._person.x=0;
        this._person.y=0;
        this.setAnchor(this._person);
        var walk:Walk=new Walk();
        var idle:Idle=new Idle ();
        idle.onEnter();
        //this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,setposition,this);
        this.addChild(this._person);
        function setposition(evt:egret.TouchEvent){
            this.SetState(walk);
            egret.Tween.get(this._person).to({x:evt.stageX,y:evt.stageY},2000, egret.Ease.sineIn );
        }
        this.SetState(idle);

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

interface State  {

      onEnter();
      
      onExit();
  }
class Idle implements State{
        private person:Person;
        private Idlelist=["Idle0_png","Idle1_png","Idle2_png","Idle3_png"];
        private count:number=-1;
        onEnter(){
            egret.startTick(this.PlayIdle,this);
        }
        onExit(){
            egret.stopTick(this.PlayIdle,this);
        }
        private PlayIdle():boolean{
          this.count++;
          if(this.count>=this.Idlelist.length)
              this.count=0;
          //var na=(i+10000).toString()+"_png";
          console.log(this.count);
          this.person._person.texture=RES.getRes(this.Idlelist[this.count]);
          return false;
        }
}
class Walk implements State{
          private Walklist=["10000_png","10001_png","10002_png","10003_png","10004_png","10005_png","10006_png","10007_png"];
          private Walkcount=-1;
          private person:Person;
          onEnter(){
                egret.Ticker.getInstance().register(this.PlayWalk,this);
          }
          onExit(){
                egret.Ticker.getInstance().unregister(this.PlayWalk,this);
          }
          private PlayWalk(){
                this.Walkcount++;
                if(this.Walkcount>=this.Walklist.length)
                    this.Walkcount=0;
                this.person._person.texture=RES.getRes(this.Walklist[this.Walkcount]);
          }
}
/*class PersonState {
        _State:State;
        public SetState(e:State){
            if(this._State){
                this._State.onExit();
            }
            e=this._State;
            this._State.onEnter();
         }
}*/