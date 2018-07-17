(function()
{
    var Engine = window.Matter.Engine,
        Events = window.Matter.Events,
        Render = window.Matter.Render,
        Runner = window.Matter.Runner,
        Body = window.Matter.Body,
        Common = window.Matter.Common,
        Composite = window.Matter.Composite,
        Composites = window.Matter.Composites,
        Constraint = window.Matter.Constraint,
        MouseConstraint = window.Matter.MouseConstraint,
        Mouse = window.Matter.Mouse,
        World = window.Matter.World,
        Bodies = window.Matter.Bodies,
        Vector = window.Matter.Vector,
        LayaRender = window.LayaRender;
        		


initworld();

function initRender(engine){
   
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 600,
            height: 650,
            showAngleIndicator: true,
            wireframes:false,
             background:'#000000',
        }
    });

    return render;
}

function initworld(){
    var engine = Engine.create(),
		world = engine.world;
    var render = initRender(engine);
    Render.run(render);
    Engine.run(engine);
    // 创建堆栈
    var stairCount = (render.bounds.max.y - render.bounds.min.y) / 44;
    var stack = Bodies.rectangle(900, 1100, 1800, 100, {
            isStatic: true,
            render: {
                
            }
    
    });
    // Composites.stack(0, 0, stairCount + 2, 1, 0, 0, function(x, y, column) {
    //     return Bodies.rectangle(x - 50, y + column * 44, 100, 1000, {
    //         isStatic: true,
    //         render: {
                
    //         }
    //     });
    // });


	var	rockOptions = {
				density: 0.004,
				render:
				{
					sprite:
					{
						texture: './res/game/rock1.png'
					}
				}
			},
			rock = Bodies.polygon(500, 900, 8, 20, rockOptions),
			anchor = {
				x: 500,
				y: 900
			},
			elastic = Constraint.create(
			{
				pointA: anchor,
				bodyB: rock,
				stiffness: 0.05,
				render:
				{
					lineWidth: 5,
					strokeStyle: '#dfa417'
				}
			});    
    // 创建障碍物
    var obstacles = Composites.stack(300, 0, 15, 3, 10, 10, function(x, y, column) {
        var sides = Math.round(Common.random(1, 8)),
            options = {
                render: {
                    fillStyle: Common.choose(['#006BA6', '#0496FF', '#D81159', '#8F2D56'])
                }
            };

        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), options);
            } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), options);
            }
        case 1:
            return Bodies.polygon(x, y, sides, Common.random(25, 50), options);
        }
    });

    //创建人类
    var ragdolls = Composite.create();

    for (var i = 0; i < 1; i += 1) {
        var ragdoll = person(200, -1000 * i, 1.3);

        Composite.add(ragdolls, ragdoll);
    }
    //, obstacles
    World.add(world, [stack, ragdolls, rock, elastic]);


    var timeScaleTarget = 1,
        counter = 0;

    Events.on(engine, 'afterUpdate', function(event) {
		var Body = window.Matter.Body,
        Bodies = window.Matter.Bodies,
        Constraint = window.Matter.Constraint,
        Composite = window.Matter.Composite,
        Common = window.Matter.Common;
		if (mouseConstraint.mouse.button === -1 && (rock.position.x > 520 || rock.position.y < 880))
		{
			rock = Bodies.polygon(500, 900, 7, 20, rockOptions);
			World.add(engine.world, rock);
			elastic.bodyB = rock;
		}
		
        // 慢动作
        // if (mouse.button === -1) {
        //     engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 0.05;
        // } else {
        //     engine.timing.timeScale = 1;
        // }

        // counter += 1;

        // 每1.5秒
        // if (counter >= 60 * 1.5) {

        //     // 翻转时间刻度
        //     if (timeScaleTarget < 1) {
        //         timeScaleTarget = 1;
        //     } else {
        //         timeScaleTarget = 0.05;
        //     }

        //     // 重置计数
        //     counter = 0;
        // }

        // for (var i = 0; i < stack.bodies.length; i += 1) {
        //     var body = stack.bodies[i];

        //     // 堆栈生成
        //     Body.translate(body, {
        //         x: -0.5 * engine.timing.timeScale,
        //         y: -0.5 * engine.timing.timeScale
        //     });

        //     // 当物体离开屏幕则循环楼梯
        //     if (body.position.x < -50) {
        //         Body.setPosition(body, {
        //             x: 50 * (stack.bodies.length - 1),
        //             y: 25 + render.bounds.max.y + (body.bounds.max.y - body.bounds.min.y) * 0.5
        //         });
                
        //         Body.setVelocity(body, {
        //             x: 0,
        //             y: 0
        //         });
        //     }
        // }

        for (i = 0; i < ragdolls.composites.length; i += 1) {
            var ragdoll = ragdolls.composites[i];
            var bounds = Composite.bounds(ragdoll);

            // 将人体移动至屏幕顶端
            if (bounds.min.y > render.bounds.max.y + 100) {
                Composite.translate(ragdoll, {
                    x: -bounds.min.x * 1.9,
                    y: -render.bounds.max.y - 400
                });
            }
        }

        // for (i = 0; i < obstacles.bodies.length; i += 1) {
        //     var body = obstacles.bodies[i],
        //         bounds = body.bounds;

        //     // 将障碍物移动至屏幕顶端
        //     if (bounds.min.y > render.bounds.max.y + 100) {
        //         Body.translate(body, {
        //             x: -bounds.min.x,
        //             y: -render.bounds.max.y - 300
        //         });
        //     }
        // }
    });

    // 添加鼠标控件
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.6,
                length: 0,
                angularStiffness: 0,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // 保持鼠标与渲染同步
    render.mouse = mouse;

    // 将渲染安装到场景中
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 1800, y: 900 }
    });

}
   
//创造人类方法
function person(x, y, scale, options) {
    scale = typeof scale === 'undefined' ? 1 : scale;

    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        Common = Matter.Common;

    var headOptions = Common.extend({
        label: 'head',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var chestOptions = Common.extend({
        label: 'chest',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
        },
        render: {
            fillStyle: '#E0A423'
        }
    }, options);

    var leftArmOptions = Common.extend({
        label: 'left-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightArmOptions = Common.extend({
        label: 'right-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var leftLegOptions = Common.extend({
        label: 'left-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightLegOptions = Common.extend({
        label: 'right-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
    var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
    var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
    var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
    var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
    var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
    var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
    var leftLowerLeg = Bodies.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
    var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
    var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);

    var chestToRightUpperArm = Constraint.create({
        bodyA: chest,
        pointA: {
            x: 24 * scale,
            y: -23 * scale
        },
        pointB: {
            x: 0,
            y: -8 * scale
        },
        bodyB: rightUpperArm,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToLeftUpperArm = Constraint.create({
        bodyA: chest,
        pointA: {
            x: -24 * scale,
            y: -23 * scale
        },
        pointB: {
            x: 0,
            y: -8 * scale
        },
        bodyB: leftUpperArm,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToLeftUpperLeg = Constraint.create({
        bodyA: chest,
        pointA: {
            x: -10 * scale,
            y: 30 * scale
        },
        pointB: {
            x: 0,
            y: -10 * scale
        },
        bodyB: leftUpperLeg,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var chestToRightUpperLeg = Constraint.create({
        bodyA: chest,
        pointA: {
            x: 10 * scale,
            y: 30 * scale
        },
        pointB: {
            x: 0,
            y: -10 * scale
        },
        bodyB: rightUpperLeg,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerRightArm = Constraint.create({
        bodyA: rightUpperArm,
        bodyB: rightLowerArm,
        pointA: {
            x: 0,
            y: 15 * scale
        },
        pointB: {
            x: 0,
            y: -25 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerLeftArm = Constraint.create({
        bodyA: leftUpperArm,
        bodyB: leftLowerArm,
        pointA: {
            x: 0,
            y: 15 * scale
        },
        pointB: {
            x: 0,
            y: -25 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerLeftLeg = Constraint.create({
        bodyA: leftUpperLeg,
        bodyB: leftLowerLeg,
        pointA: {
            x: 0,
            y: 20 * scale
        },
        pointB: {
            x: 0,
            y: -20 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var upperToLowerRightLeg = Constraint.create({
        bodyA: rightUpperLeg,
        bodyB: rightLowerLeg,
        pointA: {
            x: 0,
            y: 20 * scale
        },
        pointB: {
            x: 0,
            y: -20 * scale
        },
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var headContraint = Constraint.create({
        bodyA: head,
        pointA: {
            x: 0,
            y: 25 * scale
        },
        pointB: {
            x: 0,
            y: -35 * scale
        },
        bodyB: chest,
        stiffness: 0.6,
        render: {
            visible: false
        }
    });

    var legToLeg = Constraint.create({
        bodyA: leftLowerLeg,
        bodyB: rightLowerLeg,
        stiffness: 0.01,
        render: {
            visible: false
        }
    });

    var person = Composite.create({
        bodies: [
            chest, head, leftLowerArm, leftUpperArm, 
            rightLowerArm, rightUpperArm, leftLowerLeg, 
            rightLowerLeg, leftUpperLeg, rightUpperLeg
        ],
        constraints: [
            upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm, 
            chestToRightUpperArm, headContraint, upperToLowerLeftLeg, 
            upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
            legToLeg
        ]
    });

    return person;
};
})();