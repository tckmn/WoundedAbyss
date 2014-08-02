var WoundedAbyss = {
    init: function(cnv) {
        var dom = {
            cnv: cnv, ctx: cnv.getContext('2d'),
            w: 800, h: 600
        };

        dom.cnv.width = dom.w;
        dom.cnv.height = dom.h;

        return {
            play: function() {
                var img = new Image();
                img.onload = function() { dom.ctx.drawImage(img, 0, 0); };
                img.src = 'img/tree.png';
            }
        };
    }
};

window.addEventListener('load', function() {
    var cnv = document.getElementById('woundedabyss');
    WoundedAbyss.init(cnv).play();
});
