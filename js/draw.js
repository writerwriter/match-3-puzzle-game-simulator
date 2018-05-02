$(function () {
    var cvs = $("#simulator")[0];
    var ctx = cvs.getContext("2d");

    var mouseDown = false;
    var targetOrbPos = [0, 0];
    var BG_x_coor = [2, 86, 170, 254, 338, 422];
    var BG_y_coor = [1, 85, 169, 253, 337];
    
    var BG = new Image;
    BG.src = "../img/轉珠盤面.png";
    BG.onload=function () {
        ctx.drawImage(this, 0, 0,cvs.width,cvs.height); 
    };
    var fire_orb = new Image;
    fire_orb.src = "../img/火珠.png";
    fire_orb.onload=function(){
        ctx.drawImage(this, BG_x_coor[targetOrbPos[0]], BG_y_coor[targetOrbPos[1]], 80, 80);
    };

    function onMouseDown(evt) {
        start_x = evt.pageX - cvs.offsetLeft;
        start_y = evt.pageY - cvs.offsetTop;
        if (start_x >= BG_x_coor[targetOrbPos[0]] && start_x <= BG_x_coor[targetOrbPos[0]] + 80 && start_y >= BG_y_coor[targetOrbPos[1]] && start_y <= BG_y_coor[targetOrbPos[1]] + 80) { 
            mouseDown = true;
        }
    }

    function onMouseMove(evt) {
        if (mouseDown === true) {
            start_x = evt.pageX - cvs.offsetLeft;
            start_y = evt.pageY - cvs.offsetTop;
            ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
            ctx.drawImage(fire_orb, start_x - 40, start_y - 40, 80, 80);
        }
    }

    function onMouseUp(evt) {
        if (mouseDown === true) {
            mouseDown = false;
            end_x = evt.pageX - cvs.offsetLeft;
            end_y = evt.pageY - cvs.offsetTop;
            targetOrbPos = [Math.floor((end_x - 2) / 84), Math.floor((end_y - 1) / 84)];
            ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
            ctx.drawImage(fire_orb, BG_x_coor[targetOrbPos[0]], BG_y_coor[targetOrbPos[1]], 80, 80);
        }
    }


    cvs.addEventListener('mousedown', onMouseDown);
    cvs.addEventListener('mousemove', onMouseMove);
    cvs.addEventListener('mouseup', onMouseUp);
    

});