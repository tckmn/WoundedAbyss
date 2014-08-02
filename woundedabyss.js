function preload() {
    // foo
}

function create() {
    // bar
}

function update() {
    // baz
}

window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, {
        preload: preload,
        create: create,
        update: update
    });
};
