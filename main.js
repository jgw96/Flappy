var w = 320;
    h = 480;

var game = new Phaser.Game(w, h, Phaser.AUTO, "gameDiv");
var mainState = {
    create: function() {
      this.game.add.sprite(0,0,"sky");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = this.game.add.sprite(20, 245, "logo");
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1e3;
        //this.bird.body.setSize(100,65);
        this.input.onDown.add(this.jump, this);
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, "pipe");
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.bird.anchor.setTo(-.2, .5);
        this.jumpSound = game.add.audio("jump");
        this.dieSound = game.add.audio("die")

        //game.input.onDown.add(fullScreen, this);
    },
    update: function() {
        if (this.bird.inWorld == false) this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20) this.bird.angle += 1
    },
    jump: function() {
        if (this.bird.alive == false) return;
        this.bird.body.velocity.y = -350;
        var e = game.add.tween(this.bird);
        e.to({
            angle: -20
        }, 100);
        e.start();
        this.jumpSound.play()
    },
    restartGame: function() {
        this.dieSound.play();
        game.state.start("restart")
    },
    addOnePipe: function(e, t) {
        var n = this.pipes.getFirstDead();
        n.reset(e, t);
        n.body.velocity.x = -200;
        n.checkWorldBounds = true;
        n.outOfBoundsKill = true
    },
    addRowOfPipes: function() {
        var e = Math.floor(Math.random() * 5) + 1;
        for (var t = 0; t < 8; t++)
            if (t != e && t != e + 1) this.addOnePipe(400, t * 60 + 10);
        this.score += 1;
        this.labelScore.text = this.score
    },
    hitPipe: function() {
        if (this.bird.alive == false) return;
        this.bird.alive = false;
        game.time.events.remove(this.timer);
        this.pipes.forEachAlive(function(e) {
            e.body.velocity.x = 0
        }, this);
        this.dieSound.play();
        this.state.start("restart")
    }
};
var loadState = {
    preload: function() {
        game.load.image("sky","assets/sky.png");
        game.load.image("pipe", "assets/pipe.png");
        game.load.image("playButton", "assets/playButton.png");
        game.load.audio("jump", "assets/jump.wav");
        game.load.audio("die", "assets/death.wav");
        this.preloadBar = game.add.sprite(90, 160, "logo");
        game.load.setPreloadSprite(this.preloadBar, 0)
        this.game.stage.backgroundColor="0000FF";
    },
    create: function() {

        this.loadText = game.add.text(33, 50, "Flappy Html5", {
            font: "40px Comic Sans MS, cursive, sans-serif",
            fill: "#ffffff"
        });
        this.playButton = this.add.button(73, 350, "playButton", this.startGame, this, "buttonOver", "buttonOut", "buttonOver");


    },
    startGame: function(e) {
        this.state.start("main")
    }
};
var bootState = {
    preload: function() {
        game.load.image("logo", "assets/html5.png")
    },
    create: function() {
      this.game.scale.pageAlignHorizontally=true;
      this.game.scale.pageAlignVertically=true;
      this.game.scale.refresh()


        this.state.start("loading");
    }
};
var restartState = {
    create: function() {
        this.restartText = game.add.text(55, 50, "Try Again?", {
            font: "40px Comic Sans MS, cursive, sans-serif",
            fill: "#ffffff"
        });
        this.restartButton = this.add.button(74, 350, "playButton", this.restartGame, this, "buttonOver", "buttonOut", "buttonOver")
    },
    restartGame: function(e) {
        this.state.start("main")
    }
};
game.state.add("restart", restartState);
game.state.add("boot", bootState);
game.state.add("loading", loadState);
game.state.add("main", mainState);
game.state.start("boot");
