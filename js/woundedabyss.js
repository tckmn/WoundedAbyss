var WoundedAbyss = {
    init: function(cnv) {
        var dom = {
            cnv: cnv, ctx: cnv.getContext('2d'),
            w: 800, h: 600
        }, game = {
            w: 0, h: 0, offsetX: 0, offsetY: 0,
            map: [], objects: [], player: {},
            generateLevel: function(level) {
                var req = new XMLHttpRequest();
                req.onload = function() {
                    game.generateMap(this.responseText);
                    game.generateObjects(this.responseText);
                    game.player = game.tile('player');
                    game.player.x = game.player.y = 0;
                    game.renderAll();
                };
                req.open('get', 'lvl/' + level + '.lvl', true);
                req.send();
            },
            generateMap: function(data) {
                game.map = [];
                game.w = +data.split('\n')[0].split(',')[0];
                game.h = +data.split('\n')[0].split(',')[1];
                for (var y = 0; y < game.h; ++y) {
                    var row = [];
                    for (var x = 0; x < game.w; ++x) {
                        row.push(game.tile('grass'));
                    }
                    game.map.push(row);
                }
            },
            generateObjects: function(data) {
                for (var i = 0; i < 40; ++i) {
                    var tile = game.tile(Math.random() < 0.5 ? 'tree' : 'fireplace');
                    tile.x = Math.floor(Math.random() * game.w);
                    tile.y = Math.floor(Math.random() * game.h);
                    game.objects.push(tile);
                }
            },
            move: function(o, dx, dy) {
                var nx = o.x + dx, ny = o.y + dy;
                if (nx < 0 || nx >= game.w || ny < 0 || ny > game.h) return;
                if (game.map[nx][ny].solid) return;
                for (var i = 0; i < game.objects.length; ++i) {
                    if (game.objects[i].solid && game.objects[i].x == nx && game.objects[i].y == ny) return;
                }
                o.x = nx;
                o.y = ny;
                game.renderAll();
            },
            renderAll: function() {
                // scroll if necessary
                var playerPxX = game.player.x * 32 + 16, playerPxY = game.player.y * 32 + 16;
                var THRESHOLD = 40, PADDING = 10;
                if (playerPxX - THRESHOLD < game.offsetX) {
                    game.offsetX = Math.max(0, playerPxX + THRESHOLD + PADDING - dom.w);
                    game.offsetX = Math.min(game.offsetX, game.player.x * 32);
                }
                if (playerPxX + THRESHOLD > game.offsetX + dom.w) {
                    game.offsetX = Math.min(game.w * 32 - dom.w, playerPxX - THRESHOLD - PADDING);
                    game.offsetX = Math.min(game.offsetX, game.player.x * 32 + 32);
                }
                if (playerPxY - THRESHOLD < game.offsetY) {
                    game.offsetY = Math.max(0, playerPxY + THRESHOLD + PADDING - dom.h);
                    game.offsetY = Math.min(game.offsetY, game.player.y * 32);
                }
                if (playerPxY + THRESHOLD > game.offsetY + dom.h) {
                    game.offsetY = Math.min(game.h * 32 - dom.h, playerPxY - THRESHOLD - PADDING);
                    game.offsetY = Math.min(game.offsetY, game.player.y * 32 + 32);
                }

                for (var x = 0; x < game.w; ++x) {
                    for (var y = 0; y < game.h; ++y) {
                        game.render(game.map[y][x].img, x, y);
                    }
                }

                for (var i = 0; i < game.objects.length; ++i) {
                    var o = game.objects[i];
                    game.render(o);
                }

                game.render(game.player);
            },
            render: function(o, x, y) {
                var img, imgX, imgY;
                if (x === undefined && y === undefined) {
                    img = o.img;
                    imgFrame = o.frame || 0;
                    imgX = o.x * 32 - game.offsetX;
                    imgY = o.y * 32 - game.offsetY;
                } else {
                    img = o;
                    imgFrame = 0;
                    imgX = x * 32 - game.offsetX;
                    imgY = y * 32 - game.offsetY;
                }
                dom.ctx.drawImage(img, imgFrame * 32, 0, 32, 32, imgX, imgY, 32, 32);
            },
            tile: function(type) {
                var t = {
                    grass: {
                        img: game.images.grass
                    },
                    tree: {
                        img: game.images.tree,
                        //solid: true
                    },
                    player: {
                        img: game.images.player
                    },
                    fireplace: {
                        img: game.images.fireplace,
                        animated: true
                    }
                }[type];
                if (t === undefined) t = {};
                if (t.animated) {
                    t.frame = 0;
                    t.frames = t.img.width / 32;
                }
                t.type = type;
                return t;
            },
            images: {
                grass: 'img/grass.png',
                tree: 'img/tree.png',
                player: 'img/player.png',
                fireplace: 'img/fireplace.png'
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
                    game.generateLevel(1);

                    // add event listeners
                    window.addEventListener('keydown', function(e) {
                        var preventDefault = true;
                        switch (e.which || e.keyCode) {
                        case 37: // left
                            game.move(game.player, -1, 0);
                            break;
                        case 38: // up
                            game.move(game.player, 0, -1);
                            break;
                        case 39: // right
                            game.move(game.player, 1, 0);
                            break;
                        case 40: // down
                            game.move(game.player, 0, 1);
                            break;
                        default:
                            preventDefault = false;
                        }
                        if (preventDefault) e.preventDefault();
                    });

                    // for animated tiles
                    setInterval(function() {
                        for (var i = 0; i < game.objects.length; ++i) {
                            if (game.objects[i].frame !== undefined) {
                                game.objects[i].frame = (game.objects[i].frame + 1) % game.objects[i].frames;
                            }
                        }
                        game.renderAll();
                    }, 200);
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
