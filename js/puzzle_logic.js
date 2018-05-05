function Swap(plane, orb_a, orb_b) {
    var temp = plane[orb_a.pos_x][orb_a.pos_y].attr;
    plane[orb_a.pos_x][orb_a.pos_y].attr = plane[orb_b.pos_x][orb_b.pos_y].attr;
    plane[orb_b.pos_x][orb_b.pos_y].attr = temp;
    return plane;
}

function Drop(plane) {
    for (var i = 4; i >= 0; i--){
        for (var j = 5; j >= 0; j--){
            if (plane[i][j].attr === 0) {
                for (var k = i - 1; k >= 0; k--){
                    if (plane[k][j].attr !== 0) {
                        plane = Swap(plane, plane[k][j], plane[i][j]);
                        break;
                    }
                }
            }
        }
    }
    return plane;
}

function Pop_combo(plane, temp_cmobo_set) {
    while (typeof temp_cmobo_set !== undefined && temp_cmobo_set.length > 0) {
        var temp_combo = temp_cmobo_set[0];
        temp_cmobo_set.splice(0, 1);
        plane[temp_combo.pos_x][temp_combo.pos_y].attr = 0;
    }
    return plane;
}

function BFS_combo(plane, delete_combo_handle, temp_cmobo_set) {
    var temp_orb = delete_combo_handle[0];
    delete_combo_handle.splice(0, 1);
    plane[temp_orb.pos_x][temp_orb.pos_y].visited = true;
    temp_cmobo_set.push(plane[temp_orb.pos_x][temp_orb.pos_y]);

    if (temp_orb.pos_x - 2 >= 0 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x - 1][temp_orb.pos_y].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x - 2][temp_orb.pos_y].attr) {
        if (!plane[temp_orb.pos_x - 1][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x - 1][temp_orb.pos_y]);
        }
        if (!plane[temp_orb.pos_x - 2][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x - 2][temp_orb.pos_y]);
        }
    }
    if (temp_orb.pos_x + 2 < 5 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x + 1][temp_orb.pos_y].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x + 2][temp_orb.pos_y].attr) {
        if (!plane[temp_orb.pos_x + 1][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x + 1][temp_orb.pos_y]);
        }
        if (!plane[temp_orb.pos_x + 2][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x + 2][temp_orb.pos_y]);
        }
    }
    if (temp_orb.pos_y - 2 >= 0 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y - 1].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y - 2].attr) {
        if (!plane[temp_orb.pos_x][temp_orb.pos_y - 1].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y - 1]);
        }
        if (!plane[temp_orb.pos_x][temp_orb.pos_y - 2].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y - 2]);
        }
    }
    if (temp_orb.pos_y + 2 < 6 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y + 1].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y + 2].attr) {
        if (!plane[temp_orb.pos_x][temp_orb.pos_y + 1].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y + 1]);
        }
        if (!plane[temp_orb.pos_x][temp_orb.pos_y + 2].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y + 2]);
        }
    }
    if (temp_orb.pos_x - 1 >= 0 && temp_orb.pos_x + 1 < 5 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x - 1][temp_orb.pos_y].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x + 1][temp_orb.pos_y].attr) {
        if (!plane[temp_orb.pos_x - 1][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x - 1][temp_orb.pos_y]);
        }
        if (!plane[temp_orb.pos_x + 1][temp_orb.pos_y].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x + 1][temp_orb.pos_y]);
        }
    }
    if (temp_orb.pos_y - 1 >= 0 && temp_orb.pos_y + 1 < 6 && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y - 1].attr && plane[temp_orb.pos_x][temp_orb.pos_y].attr === plane[temp_orb.pos_x][temp_orb.pos_y + 1].attr) {
        if (!plane[temp_orb.pos_x][temp_orb.pos_y - 1].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y - 1]);
        }
        if (!plane[temp_orb.pos_x][temp_orb.pos_y + 1].visited) {
            delete_combo_handle.push(plane[temp_orb.pos_x][temp_orb.pos_y + 1]);
        }
    }
    if (delete_combo_handle.length > 0) {
        temp_combo_set = BFS_combo(plane, delete_combo_handle, temp_cmobo_set);
    }
    return temp_cmobo_set;
}
