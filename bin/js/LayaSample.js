(function () {

    Laya.MiniAdpter.init();

    var Loader = laya.net.Loader,
        Handler = laya.utils.Handler,
        WebGL = laya.webgl.WebGL,
        Sprite = Laya.Sprite,
        Stage = Laya.Stage,
        Render = Laya.Render,
        Browser = Laya.Browser,
        WebGL = Laya.WebGL,
        stageWidth = 800,
        stageHeight = 600,
        Matter = window.Matter,
        LayaRender = window.LayaRender,
        mouseConstraint,
        engine,
        Stage = Laya.Stage;
    /***当前多点触摸id****/
    var curTouchId = 0;
    /***手指（鼠标）是否按下****/
    var isDown = false;


    Laya.init(stageWidth, stageHeight);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;
    Laya.stage.scaleMode = "showall";
    Laya.stage.on("resize", this, onResize);
    //鼠标按下事件监听

    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, onMouseDown);
    //鼠标抬起事件监听
    Laya.stage.on(Laya.Event.MOUSE_UP, this, onMouseUp);

    setup();

    /*鼠标按下事件回调*/
    function onMouseDown(e) {
        //左右手遥控
        if (this.isleftControl) {
            //如果按下时是右边屏幕位置或已经按下鼠标，则返回
            if (e.stageX > Laya.stage.width / 2 || isDown) return;
        }
        else {
            //如果按下时是左边屏幕位置或已经按下鼠标，则返回
            if (e.stageX < Laya.stage.width / 2 || isDown) return;
        }
        //记录当前按下id
        curTouchId = e.touchId;
        //已按下
        isDown = true;
        //摇杆移动控制事件监听
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMove);
    }

    /*鼠标抬起事件回调*/
    function onMouseUp(e) {
        //如果不是上次的点击id，返回（避免多点抬起，以第一次按下id为准）
        if (e.touchId != curTouchId) return;
        isDown = false;
        visible = false;
        //移除移动事件监听
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, onMove);

        var allBodies = Matter.Composite.allComposites(engine.world);
        allBodies[1].constraints[0].stiffness=0.001;
 
       //if (allBodies[0].bodies[1].bounds.max.y > 444) {
            var ball1 = ball(allBodies[0], 'http://onvcb3rbt.bkt.clouddn.com/rock1.png');

            Matter.World.add(engine.world, ball1);
            var bally = allBodies[0].bodies[6].position.y - mouseConstraint.mouse.position.y,
                ballx = allBodies[0].bodies[6].position.x - mouseConstraint.mouse.position.x,
                Ang = 360 * Math.atan(bally / ballx) / (2 * Math.PI);
            addForce(ballx/2, Ang-70, ball1);


       // }


    }

    /*鼠标移动事件回调*/
    function onMove(e) {
        //如果不是上次的点击id，返回（避免多点抬起，以第一次按下id为准）
        if (e.touchId != this.curTouchId) return;
    }

    function setup() {
        initMatter();
        initworld();
    }


    function initMatter() {
        var gameWorld = new Sprite();
        Laya.stage.addChild(gameWorld);

        // 初始化物理引擎
        engine = Matter.Engine.create(
            {
                enableSleeping: true
            });

        Matter.Engine.run(engine);


        var render = LayaRender.create(
            {
                engine: engine,
                width: 800,
                height: 600,
                options:
                    {
                        background: 'http://op1tao0gx.bkt.clouddn.com/background.png',
                        wireframes: false
                    }
            });

        LayaRender.run(render);

        mouseConstraint = Matter.MouseConstraint.create(engine,
            {
                constraint:
                    {
                        angularStiffness: 0.1,
                        stiffness: 1
                    },
                element: Render.canvas
            });
        Matter.World.add(engine.world, mouseConstraint);
        render.mouse = mouseConstraint.mouse;
    }

    function onResize() {
        // 设置鼠标的坐标缩放
        // Laya.stage.clientScaleX代表舞台缩放
        // Laya.stage._canvasTransform代表画布缩放

        Matter.Mouse.setScale(mouseConstraint.mouse,
            {
                x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
            });
    }

    function initworld() {




        // 创建地板
        var ground = Matter.Bodies.rectangle(395, 600, 815, 50,
            {
                isStatic: true,
                render:
                    {
                        visible: false
                    }
            }),
            ground3 = Matter.Bodies.rectangle(-40, 600, 50, 11815,
                {
                    isStatic: true,
                    render:
                        {
                            strokeStyle: '#dfa417'

                        }
                }),
            ground4 = Matter.Bodies.rectangle(840, 600, 50, 11815,
                {
                    isStatic: true,
                    render:
                        {
                            strokeStyle: '#dfa417'

                        }
                }),
            ground2 = Matter.Bodies.rectangle(610, 250, 100, 40,
                {
                    isStatic: true,
                    render:
                        {
                            fillStyle: '#edc51e',
                            strokeStyle: '#b5a91c'
                        }
                }),
            ground5 = Matter.Bodies.rectangle(610, 250, 100, 40,
                {
                    isStatic: true,
                    render:
                        {
                            fillStyle: '#edc51e',
                            strokeStyle: '#b5a91c'
                        }
                }),
            ground6 = Matter.Bodies.rectangle(400, 150, 60, 100,
                {
                    isStatic: true,
                    render:
                        {
                            fillStyle: '#edc51e',
                            strokeStyle: '#b5a91c'
                        }
                }),
            ground7 = Matter.Bodies.rectangle(200, 200, 60, 100,
                {
                    isStatic: true,
                    render:
                        {
                            fillStyle: '#edc51e',
                            strokeStyle: '#b5a91c'
                        }
                });

        //创建人类
        var ragdolls = Matter.Composite.create(),
            ragdoll1 = person(180, 475, '#FFFFFF', true,0.8),
            ragdoll2 = person(590, 475, '#000000', false,0.8);

        // Matter.Composites.chain(ragdoll1, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
        // Matter.Composite.add(ragdoll1, Matter.Constraint.create({
        //     bodyB: ragdoll1.bodies[0],
        //     pointB: { x: 0, y: -200 },
        //     pointA: { x: ragdoll1.bodies[0].position.x, y: ragdoll1.bodies[1].position.y },
        //     stiffness: 1.5
        // }));
        Matter.World.add(engine.world, [mouseConstraint, ground, ragdoll1, ragdoll2, ground3, ground4, ground5, ground6, ground7]);

        //后续设定
        Matter.Events.on(engine, 'afterUpdate', function (event) {
            var Body = window.Matter.Body,
                Bodies = window.Matter.Bodies,
                Constraint = window.Matter.Constraint,
                Composite = window.Matter.Composite,
                Common = window.Matter.Common;

            // if (mouseConstraint.mouse.button === -1 && ragdoll1.bodies[1].bounds.max.y < 449 &&
            //     ragdoll1.bodies[1].bounds.max.y > 448) {
            //     var ball1 = ball(ragdoll1, 'http://onvcb3rbt.bkt.clouddn.com/rock1.png');
            //     Matter.World.add(engine.world, ball1);
            //     var bally = Composite.bounds(ragdoll1).min.y - mouseConstraint.mouse.position.y,
            //         ballx = Composite.bounds(ragdoll1).min.x - mouseConstraint.mouse.position.x,
            //         Ang = 360 * Math.atan(bally / ballx) / (2 * Math.PI);

            //     addForce(ballx, Ang, ball1);

            // }
            if(ragdoll2.bodies[6].bounds.min.y>521){
                var allBoies=Matter.Composite.allComposites(engine.world);
                allBoies[1].constraints[0].stiffness=2;
        

                        var all = Matter.Composite.allBodies(engine.world);
            all.forEach(function(value,i){
         

        })

            }
            
            var bounds1 = Composite.bounds(ragdoll1);
            var bounds2 = Composite.bounds(ragdoll2);
            // 设置人偶回到界面

            if (bounds1.min.y > 1100) {
                Composite.translate(ragdoll1, {
                    x: -bounds1.min.x * 0.9,
                    y: -bounds1.max.y
                });
            }


            if (bounds2.min.y > 1100) {
                Composite.translate(ragdoll2, {
                    x: -bounds2.min.x * 0.9,
                    y: -bounds2.max.y
                });
            }
        });

    }


    function ball(ragdoll, img) {

        var ball = Matter.Bodies.circle(Matter.Composite.bounds(ragdoll).min.x , Matter.Composite.bounds(ragdoll).min.y - 5, 25, {
            label:'balltest',
            density: 0.6, // 密度
            restitution: 0.1,// 弹性
            isStatic: false,
            collisionFilter: {
                group: -1
            },
            render:
                {
                    sprite:
                        {
                            texture: img,
                            xOffset: 23.5,
                            yOffset: 23.5
                        }
                }
        });

        return ball;
    }

    //创造人类方法
    function person(x, y, color,isStat,scale, options) {
        scale = typeof scale === 'undefined' ? 1 : scale;

        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composite = Matter.Composite,
            Common = Matter.Common,
            Sleeping = Matter.Sleeping;

        //头部
        var headOptions = Common.extend({
            label: 'head',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            // 圆角
            chamfer: {
                radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
            },
            render: {
                fillStyle: color
            }
        }, options);

        //上身
        var chestOptions = Common.extend({
            label: 'chest',
            collisionFilter: {
                group: Body.nextGroup(true)
            },

            render: {
                fillStyle: color
            }
        }, options);

        var bottomOptions = Common.extend({
            label: 'bottom',
            isStatic: false, //静止
            
            collisionFilter: {
                group: -1
            },
            render: {

                fillStyle: color
            }
        }, options);
        //左侧第一节胳膊
        var leftArmOptions = Common.extend({
            label: 'left-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: color
            }
        }, options);
        //左侧第二节胳膊
        var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
            render: {
                fillStyle: color
            }
        });

        //右侧第一节胳膊
        var rightArmOptions = Common.extend({
            label: 'right-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: color
            }
        }, options);

        //右侧第二节胳膊
        var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
            render: {
                fillStyle: color
            }
        });


        //右侧大腿
        var rightLegOptions = Common.extend({
            label: 'right-leg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            render: {
                fillStyle: color
            }
        }, options);


        //头部
        var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions),
            //上身
            chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions),

            //腰部
            //右侧第一节胳膊
            rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions),
            //右侧第二节胳膊
            rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions),

            //左边

            //左侧第一节胳膊
            leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions),
            //左侧第二节胳膊
            leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions),
            //下身
            bottom = Bodies.rectangle(x, y + 80 * scale, 55 * scale, 81 * scale, bottomOptions),

            //头部连接上身
            headContraint = createBody(head, chest, 0, 25, 0, -35, scale),

            //上身连接下身
            chestContraint = createBody(chest, bottom, 0, 35, 0, -45, scale),

            //上身连接左侧第一节胳膊
            chestToLeftUpperArm = createBody(chest, leftUpperArm, -24, -23, 0, -8, scale),

            //左侧第一节胳膊连接左侧第二节胳膊
            upperToLowerLeftArm = createBody(leftUpperArm, leftLowerArm, 0, 15, 0, -25, scale),

            //上身连接右侧第一节胳膊
            chestToRightUpperArm = createBody(chest, rightUpperArm, 24, -23, 0, -8, scale),

            //右侧第一节胳膊连接右侧第二节胳膊
            upperToLowerRightArm = createBody(rightUpperArm, rightLowerArm, 0, 15, 0, -25, scale);
            

        var constraint = Matter.Constraint.create({
            label:'lines',
        
            stiffness:2,
            pointA: { x: x, y: 300 },
            render:{visible:false},
            bodyB: head,
            pointB: { x: 0, y: -10 }
        });

        var person = Composite.create({
            //肢体集合
            bodies: [
                chest,
                head,
                leftLowerArm,
                leftUpperArm,
                rightLowerArm,
                rightUpperArm,
                bottom

            ],
            //连接集合
            constraints: [
                constraint,
                upperToLowerLeftArm,
                upperToLowerRightArm,
                chestToLeftUpperArm,
                chestToRightUpperArm,
                headContraint,
                chestContraint

            ]
        });
        return person;
    }


    function createBody(bodyA, bodyB, Ax, Ay, Bx, By, scale) {

        var body = Matter.Constraint.create({
            bodyA: bodyA,
            bodyB: bodyB,
            pointA: {
                x: Ax * scale,
                y: Ay * scale
            },
            pointB: {
                x: Bx * scale,
                y: By * scale
            },
            render: {
                visible: false
            }
        });
        return body;
    }

    function addForce(x, y, ball) {
        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composite = Matter.Composite,
            Common = Matter.Common;


        var forceMagnitude = 0.02 * ball.mass;
        ball.isStatic = false;
        Body.applyForce(ball, ball.position, {
            x: x,//(forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y: y,//-forceMagnitude + Common.random() * -forceMagnitude


        });


    }

//程序入口
    Laya.init(600, 400);
})();