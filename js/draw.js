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

    var enable_drop = false;

    var plane_attr = [
        [3, 1, 5, 2, 2, 2],
        [1, 1, 1, 3, 1, 1],
        [3, 1, 5, 1, 4, 6],
        [3, 4, 5, 1, 4, 6],
        [6, 6, 6, 1, 3, 6]
    ];

    function Plane(attr, visited, pos_x, pos_y) {
        this.attr = attr;
        this.visited = visited;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }

    var plane = new Array();

    for (var i = 0; i < 5; i++){
        plane[i] = new Array();
        for (var j = 0; j < 6; j++){
            plane[i][j] = new Plane(plane_attr[i][j],false,i,j);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    function RandomGeneratePlane() {
        $("#combo_text").text("combo:0");
        do{
            for (var i = 0; i < 5; i++){
                for (var j = 0; j < 6; j++){
                    plane[i][j].attr = Math.floor(Math.random() * 6 + 1);
                }
            }
        }while(check_combo(plane));
    }

    function orbOnload() {
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 5; j++){
                if (plane_attr[j][i] === this.number) {
                    ctx.drawImage(this, BG_x_coor[i], BG_y_coor[j], 80, 80);
                }
            }
        }
    };

    function swap(i1, j1, i2, j2) {
        if (i1 >= 0 && i1 < 6 && j1 >= 0 && j1 < 5 && i2 >= 0 && i2 < 6 && j2 >= 0 && j2 < 5) { 
            temp = plane[j1][i1].attr;
            plane[j1][i1].attr = plane[j2][i2].attr;
            plane[j2][i2].attr = temp;
        }
    }

    function drawOrb(disable_disappear) {
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 6; j++){
                for (var k = 0; k < 5; k++){
                    if (plane[k][j].attr === orb[i].number && ((targetOrbPos[0] != j || targetOrbPos[1] != k) || disable_disappear)) {
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
        targetOrbNum = plane[targetOrbPos[1]][targetOrbPos[0]].attr;
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

            puzzle_elim(plane);
        }
    }

    function check_combo(plane) {
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 6; j++) {
                if (j + 2 < 6 && plane[i][j].attr !== 0 && plane[i][j].attr === plane[i][j + 1].attr && plane[i][j].attr === plane[i][j + 2].attr){
                    return true;
                }
                else if (i + 2 < 5 && plane[i][j].attr !== 0 && plane[i][j].attr === plane[i + 1][j].attr && plane[i][j].attr === plane[i + 2][j].attr){
                    return true;
                }
            }
        }
        return false;
    }    

    function generate_drop(plane){
        for(var i = 0; i < 5; i++){
            for(var j = 0; j < 6; j++){
                if(plane[i][j].attr === 0){
                    plane[i][j].attr = Math.floor(Math.random() * 6 + 1);
                }
            }
        }
        return plane;
    }

    async function puzzle_elim(plane) {
        var combo = 0;
        var total_combo = 0;
        do {
            combo = 0;
            for (var i = 0; i < 5; i++){
                for (var j = 0; j < 6; j++){
                    if (j + 2 < 6 && !plane[i][j].visited && plane[i][j].attr !== 0 && plane[i][j].attr === plane[i][j + 1].attr && plane[i][j].attr === plane[i][j + 2].attr) {
                        var delete_combo_handle = new Array();
                        delete_combo_handle.push(plane[i][j]);
                        var temp_combo_set = BFS_combo(plane, delete_combo_handle, new Array());
                        plane = Pop_combo(plane, temp_combo_set);
                        ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
                        drawOrb(true);
                        combo++;
                        total_combo++;
                        $("#combo_text").text( "combo:" + total_combo);
                        await sleep(500);
                    }
                    else if (i + 2 < 5 && !plane[i][j].visited && plane[i][j].attr !== 0 && plane[i][j].attr === plane[i + 1][j].attr && plane[i][j].attr === plane[i + 2][j].attr) {
                        var delete_combo_handle = new Array();
                        delete_combo_handle.push(plane[i][j]);
                        var temp_combo_set = BFS_combo(plane, delete_combo_handle, new Array());
                        plane = Pop_combo(plane, temp_combo_set);
                        ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
                        drawOrb(true);
                        combo++;
                        total_combo++;
                        $("#combo_text").text( "combo:" + total_combo);
                        await sleep(500);
                    }
                }
            }
            plane = Drop(plane);
            ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
            drawOrb(true);
            await sleep(500);

            if(enable_drop){
                plane = generate_drop(plane);
                ctx.drawImage(BG, 0, 0, cvs.width, cvs.height);
                drawOrb(true);
                await sleep(500);
            }

            for (var i = 0; i < 5; i++){
                for (var j = 0; j < 6; j++){
                    plane[i][j].visited = false;
                }
            }

        } while (combo != 0);
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

    $("#enableDrop").on("click",function(){
        if($("#enableDrop").hasClass('active')){
            enable_drop = false;
        }
        else{
            enable_drop = true;
        }
    })


});