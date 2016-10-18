var Person = (function (_super) {
    __extends(Person, _super);
    function Person() {
        _super.call(this);
    }
    var d = __define,c=Person,p=c.prototype;
    p.SetState = function (e) {
        if (this._State) {
            this._State.onExit();
        }
        e = this._State;
        this._State.onEnter();
    };
    p.Creat = function () {
        this._person = this.createBitmapByName("10000_png");
        this._person.x = 0;
        this._person.y = 0;
        this.setAnchor(this._person);
        var walk = new Walk();
        var idle = new Idle();
        idle.onEnter();
        //this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,setposition,this);
        this.addChild(this._person);
        function setposition(evt) {
            this.SetState(walk);
            egret.Tween.get(this._person).to({ x: evt.stageX, y: evt.stageY }, 2000, egret.Ease.sineIn);
        }
        this.SetState(idle);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.setAnchor = function (e) {
        e.$setAnchorOffsetX(e.width / 2);
        e.$setAnchorOffsetY(e.height / 2);
    };
    return Person;
}(egret.DisplayObjectContainer));
egret.registerClass(Person,'Person');
var Idle = (function () {
    function Idle() {
        this.Idlelist = ["Idle0_png", "Idle1_png", "Idle2_png", "Idle3_png"];
        this.count = -1;
    }
    var d = __define,c=Idle,p=c.prototype;
    p.onEnter = function () {
        egret.startTick(this.PlayIdle, this);
    };
    p.onExit = function () {
        egret.stopTick(this.PlayIdle, this);
    };
    p.PlayIdle = function () {
        this.count++;
        if (this.count >= this.Idlelist.length)
            this.count = 0;
        //var na=(i+10000).toString()+"_png";
        console.log(this.count);
        this.person._person.texture = RES.getRes(this.Idlelist[this.count]);
        return false;
    };
    return Idle;
}());
egret.registerClass(Idle,'Idle',["State"]);
var Walk = (function () {
    function Walk() {
        this.Walklist = ["10000_png", "10001_png", "10002_png", "10003_png", "10004_png", "10005_png", "10006_png", "10007_png"];
        this.Walkcount = -1;
    }
    var d = __define,c=Walk,p=c.prototype;
    p.onEnter = function () {
        egret.Ticker.getInstance().register(this.PlayWalk, this);
    };
    p.onExit = function () {
        egret.Ticker.getInstance().unregister(this.PlayWalk, this);
    };
    p.PlayWalk = function () {
        this.Walkcount++;
        if (this.Walkcount >= this.Walklist.length)
            this.Walkcount = 0;
        this.person._person.texture = RES.getRes(this.Walklist[this.Walkcount]);
    };
    return Walk;
}());
egret.registerClass(Walk,'Walk',["State"]);
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
//# sourceMappingURL=Person.js.map