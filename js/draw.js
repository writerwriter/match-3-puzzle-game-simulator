$(function () {
    //get canvas object
    var cvs = $("#simulator")[0];
    var ctx = cvs.getContext("2d");

    var mouseDown = false;
    var targetOrbPos = [0, 0];
    var targetOrbNum = 0;
    var BG_x_coor = [2, 86, 170, 254, 338, 422];
    var BG_y_coor = [1, 85, 169, 253, 337];

    var BG = new Image;
    var orbMap = ["火", "水", "木", "光", "暗", "心"];
    var orb = new Array();

    var plane = [
        [3, 1, 5, 2, 2, 2],
        [1, 1, 1, 3, 1, 1],
        [3, 1, 5, 1, 4, 6],
        [3, 4, 5, 1, 4, 6],
        [6, 6, 6, 1, 3, 6]
    ];

    function RandomGeneratePlane() {
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 5; j++){
                plane[j][i] = Math.floor(Math.random() * 6 + 1);
            }
        }
    }

    function orbOnload() {
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 5; j++){
                if (plane[j][i] === this.number) {
                    ctx.drawImage(this, BG_x_coor[i], BG_y_coor[j], 80, 80);
                }
            }
        }
    };

    function swap(i1, j1, i2, j2) {
        if (i1 >= 0 && i1 < 6 && j1 >= 0 && j1 < 5 && i2 >= 0 && i2 < 6 && j2 >= 0 && j2 < 5) { 
            temp = plane[j1][i1];
            plane[j1][i1] = plane[j2][i2];
            plane[j2][i2] = temp;
        }
    }

    function drawOrb(disable_disappear) {
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 6; j++){
                for (var k = 0; k < 5; k++){
                    if (plane[k][j] === orb[i].number && ((targetOrbPos[0] != j || targetOrbPos[1] != k) || disable_disappear)) {
                        ctx.drawImage(orb[i], BG_x_coor[j], BG_y_coor[k], 80, 80);
                    }
                }
            }
        }
    }

    function onMouseDown(evt) {
        start_x = evt.pageX - cvs.offsetLeft;
        start_y = evt.pageY - cvs.offsetTop;
        targetOrbPos = [Math.floor((start_x - 2) / 84), Math.floor((start_y - 1) / 84)];
        targetOrbNum = plane[targetOrbPos[1]][targetOrbPos[0]];
        mouseDown = true;
    }

    function onMouseMove(evt) {
        if (mouseDown === true) {
            start_x = evt.pageX - cvs.offsetLeft;
            start_y = evt.pageY - cvs.offsetTop;
            currentPos = [Math.floor((start_x - 2) / 84), Math.floor((start_y - 1) / 84)];
            if (currentPos[0] != targetOrbPos[0] || currentPos[1] != targetOrbPos[1]) {
                swap(currentPos[0], currentPos[1], targetOrbPos[0], targetOrbPos[1]);
                targetOrbPos = currentPos;
            }
            ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
            drawOrb(false);
            ctx.drawImage(orb[targetOrbNum - 1], start_x - 40, start_y - 40, 80, 80);
        }
    }

    function onMouseUp(evt) {
        if (mouseDown === true) {
            mouseDown = false;
            end_x = evt.pageX - cvs.offsetLeft;
            end_y = evt.pageY - cvs.offsetTop;
            targetOrbPos = [Math.floor((end_x - 2) / 84), Math.floor((end_y - 1) / 84)];
            ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
            drawOrb(false);
            ctx.drawImage(orb[targetOrbNum - 1], BG_x_coor[targetOrbPos[0]], BG_y_coor[targetOrbPos[1]], 80, 80);
        }
    }

    //setting src
    BG.src = "../img/轉珠盤面.png";
    for (var i = 0; i < 6; i++){
        orb[i] = new Image;
        orb[i].src = "../img/" + orbMap[i] + "珠.png";
        orb[i].number = i + 1;
    }
    //onload image
    BG.onload=function () {
        ctx.drawImage(this, 0, 0,cvs.width,cvs.height); 
    };
    for (var i = 0; i < 6; i++){
        orb[i].onload = orbOnload;
    }
    //add event listener
    cvs.addEventListener('mousedown', onMouseDown);
    cvs.addEventListener('mousemove', onMouseMove);
    cvs.addEventListener('mouseup', onMouseUp);
    cvs.addEventListener('mouseout', onMouseUp);
    
    $("#randomGeneratePlane").on("click", function () {
        RandomGeneratePlane();
        ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
        drawOrb(true);
    });

});