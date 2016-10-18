//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    //public sssssss;
    function Main() {
        _super.call(this);
        this._personStay = new Array();
        this._personWalk = new Array();
        this.state = 0;
        this.Idlelist = ["Idle0_png", "Idle1_png", "Idle2_png", "Idle3_png"];
        this.Idlecount = -1;
        this.Walklist = ["10000_png", "10001_png", "10002_png", "10003_png", "10004_png", "10005_png", "10006_png", "10007_png"];
        this.Walkcount = -1;
        this.i = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var _this = this;
        var bg = this.createBitmapByName("bg_jpg");
        bg.width = this.stage.stageWidth;
        bg.height = this.stage.stageHeight;
        this.addChild(bg);
        /* var p:Person=new Person();
         p.Creat();
         this.addChild(p);*/
        /*  this.container = new egret.DisplayObjectContainer();
          this.addChild(this.container);
          this.container.x = 250;
          this.container.y = 350;
          */
        this._person = this.createBitmapByName("10000_png");
        this.IdlePlay();
        this.stage.$touchEnabled = true;
        this._person.x = 111;
        this._person.y = 111;
        this.setAnchor(this._person);
        var x;
        var y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.WalkPlay();
            _this.StopIdlePlay();
            if (_this.state == 0) {
                egret.Tween.get(_this._person).to({ x: evt.stageX, y: evt.stageY }, 2000, egret.Ease.sineIn);
                console.log(_this._person.x + "," + _this._person.y);
                console.log(evt.stageX + ",,,,," + evt.stageY);
            }
            else {
                egret.Tween.removeTweens(_this._person);
                egret.Tween.get(_this._person).to({ x: evt.stageX, y: evt.stageY }, 2000, egret.Ease.sineIn);
            }
            _this.state = 1;
            x = evt.stageX;
            y = evt.stageY;
        }, this);
        this.addChild(this._person);
        egret.startTick(function () {
            if (_this._person.x == x && _this._person.y == y) {
                _this.StopWalkPlay();
                _this.PlayIdle();
                console.log("123456498");
                _this.state = 0;
            }
            return false;
        }, this);
    };
    p.IdlePlay = function () {
        egret.startTick(this.PlayIdle, this);
    };
    p.PlayIdle = function () {
        this.Idlecount++;
        this.i++;
        if (this.Idlecount >= this.Idlelist.length)
            this.Idlecount = 0;
        //console.log(this.Idlecount);
        if (this.i == 10) {
            this._person.texture = RES.getRes(this.Idlelist[this.Idlecount]);
            this.i = 0;
        }
        return false;
    };
    p.StopIdlePlay = function () {
        egret.stopTick(this.PlayIdle, this);
    };
    p.WalkPlay = function () {
        egret.startTick(this.PlayWalk, this);
    };
    p.PlayWalk = function () {
        this.Walkcount++;
        this.i++;
        //console.log(this.i);
        if (this.Walkcount >= this.Walklist.length)
            this.Walkcount = 0;
        if (this.i == 10) {
            this._person.texture = RES.getRes(this.Walklist[this.Walkcount]);
            this.i = 0;
        }
        return false;
    };
    p.StopWalkPlay = function () {
        egret.stopTick(this.PlayWalk, this);
    };
    p.setAnchor = function (e) {
        e.$setAnchorOffsetX(e.width / 2);
        e.$setAnchorOffsetY(e.height / 2);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
/*
class ss{
   public ssss(e:Main){
       e.sssssss;
   }
}*/ 
//# sourceMappingURL=Main.js.map