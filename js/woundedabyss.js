var WoundedAbyss = {
    init: function(cnv) {
        var dom = {
            cnv: cnv, ctx: cnv.getContext('2d'),
            w: 800, h: 600
        }, game = {
            w: Math.floor(dom.w / 32), h: Math.floor(dom.h / 32),
            map: [],
            objects: [],
            player: {},
            generateLevel: function(level) {
                game.generateMap(level);
                game.generateObjects(level);
                game.player = game.tile('player');
                game.player.x = game.player.y = 0;
                game.renderAll();
            },
            generateMap: function(level) {
                for (var x = 0; x < game.map[0].length; ++x) {
                    for (var y = 0; y < game.map.length; ++y) {
                        game.map[y][x] = game.tile('grass');
                    }
                }
            },
            generateObjects: function(level) {
                for (var i = 0; i < 20; ++i) {
                    var tree = game.tile('tree');
                    tree.x = Math.floor(Math.random() * game.w);
                    tree.y = Math.floor(Math.random() * game.h);
                    game.objects.push(tree);
                }
            },
            renderAll: function() {
                for (var x = 0; x < game.map[0].length; ++x) {
                    for (var y = 0; y < game.map.length; ++y) {
                        dom.ctx.drawImage(game.map[y][x].img, x * 32, y * 32);
                    }
                }

                for (var i = 0; i < game.objects.length; ++i) {
                    var o = game.objects[i];
                    dom.ctx.drawImage(o.img, o.x * 32, o.y * 32);
                }

                dom.ctx.drawImage(game.player.img, game.player.x * 32, game.player.y * 32);
            },
            tile: function(type) {
                var t = {
                    grass: {
                        img: game.images.grass
                    },
                    tree: {
                        img: game.images.tree
                    },
                    player: {
                        img: game.images.player
                    }
                }[type];
                if (t === undefined) t = {};
                t.type = type;
                return t;
            },
            images: {
                grass: 'img/grass.png',
                tree: 'img/tree.png',
                player: 'img/player.png'
            },
            init: function() {
                // preload images
                var imageCount = imageLoadedCount = 0;
                for (var imageName in game.images) {
                    ++imageCount;
                    var imageUrl = game.images[imageName];
                    var image = new Image();
                    image.onload = function() {
                        ++imageLoadedCount;
                        if (imageCount === imageLoadedCount) {
                            onImagesPreloaded();
                        }
                    };
                    image.src = imageUrl;
                    game.images[imageName] = image;
                }

                function onImagesPreloaded() {
                    // initialize level 1
                    game.map = [];
                    for (var y = 0; y < game.h; ++y) {
                        game.map[y] = [];
                        for (var x = 0; x < game.w; ++x) {
                            game.map[y][x] = {};
                        }
                    }
                    game.generateLevel(1);
                }
            }
        };

        dom.cnv.width = dom.w;
        dom.cnv.height = dom.h;

        return {
            play: function() {
                game.init();
            }
        };
    }
};

window.addEventListener('load', function() {
    var cnv = document.getElementById('woundedabyss');
    WoundedAbyss.init(cnv).play();
});
