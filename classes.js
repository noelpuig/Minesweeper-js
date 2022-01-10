class cell {
    constructor(posx, posy, type, hidden, innercoords, dimensions) {
        this.y = posy;
        this.x = posx;
        this.type = type;
        this.innercoords = innercoords;
        this.dim = dimensions;
        this.hasbomb = false;
        this.hidden = hidden;
        this.number = 0;
        this.flagged = false;

        
        this.img = new Image();
        this.img.src = 'C:\\Users\\noelp\\Desktop\\buscamines\\flag.png';
    }
    getCoords() {
        return [this.x, this.y];
    }
    flag () {
        if (this.flagged == true) {this.flagged = false;}
        else {this.flagged = true;}
        return false;
    }
    isFlagged () {
        return this.flagged;
    }
    getType () {
        return this.type;
    }
    getX () {
        return this.x;
    }
    getY () {
        return this.y;
    }
    addBomb () {
        this.hasbomb = true;
    }
    hasBomb () {
        return this.hasbomb;
    }
    getInnerCoords () {
        return this.innercoords;
    }
    
    changeType (type) {
        this.type = type;
    }
    setNum (value) {
        this.number = value;
    }
    getNum () {return this.number;}
    hide(value) {
        this.hidden = value;
        if (value == false) {
            this.flagged = false;
        }
    }
    ishidden () {
        return this.hidden;
    }
    draw() {
        /*
        switch (this.type) {
            case 'bomb':
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.dim, this.dim);
                ctx.fillStyle = 'white';
                ctx.fill();
                break;
            case 'default':
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.dim, this.dim);
                ctx.fillStyle = 'blue';
                ctx.fill();
                //ctx.stroke();
                break;
            case 'red':
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.dim, this.dim);
                ctx.fillStyle = 'red';
                ctx.fill();
                break;
            case 'yellow':
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.dim, this.dim);
                ctx.fillStyle = 'yellow';
                ctx.fill();
                break;
        }
        if (!this.hidden) {
            if (this.hasbomb) {
                let i = (this.dim * 0.2)
                ctx.font = this.dim - i + 'px serif';
                ctx.fillStyle = 'black';
                ctx.fillText('B', this.x + i, this.y + this.dim - i);
                console.log('painted text');
            } 
        } else {
        */
        if (this.hidden) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.dim, this.dim);
            ctx.fillStyle = 'lightgrey';
            ctx.fill();
            ctx.strokeStyle = 'darkgrey'
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.dim, this.dim);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'lightgrey'
            ctx.stroke();
               
            if (this.number != 0) {
                let num = this.number;
                let i = (this.dim * 0.2)
                ctx.font = this.dim - i + 'px serif';
                switch (num) {
                    case 1:
                        ctx.fillStyle = '#0100fb';
                        break;
                    case 2:
                        ctx.fillStyle = '#007E03';
                        break;
                    case 3:
                        ctx.fillStyle = '#0001FB';
                        break;
                    case 4:
                        ctx.fillStyle = '#00017E';
                        break;
                    case 5:
                        ctx.fillStyle = '#03027F';
                        break;
                    case 6:
                        ctx.fillStyle = '#7D7F00';
                        break;
                    case 7:
                        ctx.fillStyle = 'black';
                        break;
                    case 8:
                        ctx.fillStyle = '#808080'
                        break;
                } 
                ctx.fillText(num, this.x + i, this.y + this.dim - i);
            }
        }
        if (this.flagged) {
            ctx.drawImage(this.img, this.x, this.y, this.dim, this.dim);
            console.log('flag')
        }
    }   
    revealBomb () {
        let bmb = new Image();
        bmb.src = 'C:\\Users\\noelp\\Desktop\\buscamines\\bomb.png';
        ctx.drawImage(bmb, this.x, this.y, this.dim, this.dim);
        if (this.flagged) {
            ctx.drawImage(this.img, this.x, this.y, this.dim, this.dim);
        }
    }
    drawFlag () {
        ctx.drawImage(this.img, this.x, this.y, this.dim, this.dim);
        console.log('flag')
    }
}



class grid {
    constructor (width ,height, bomb_n) {
        this.bomb_n = bomb_n;

        this.grid = [];
        this.dim = 25;

        if (Math.round(width/this.dim) != width/this.dim) {
            alert('canvas divisable by ' + this.dim + ', cant make up a grid');
        }
        this.hor = width/this.dim;
        this.ver = height/this.dim;

        for (let y = 0; y < this.ver; y++) {
            for (let x = 0; x < this.hor; x++) {
                this.grid.push(new cell(x * this.dim , y * this.dim, 'default', true, [x, y], this.dim));
            }   
        }

        let positions = [];
        for (let y = 0; y < this.bomb_n; y++) {
            let max = this.grid.length;
            let min = 0;
            positions.push(Math.round(Math.random() * (max - min) + min));
        }
        this.bombs = [];
        for (let y = 0; y < positions.length; y++) {
            let index = positions[y];
            this.grid[index].addBomb();
            this.bombs.push(this.grid[index]);
        }
    }

    getGrid () {
        return this.grid;
    }

    getDim() {
        return this.dim;
    }

    isOutOfBorder (coords) {
        let x = coords[0];
        let y = coords[1];
        if (
            x < 0 ||
            y < 0 ||
            x >= this.hor ||
            y >= this.ver  
        ) {
            return true;
        } else {
            return false;
        }
    }

    getCell (coords) {
        if (!this.isOutOfBorder(coords)) {
            for (let y = 0; y < this.grid.length; y++) {
                let Cell = this.grid[y];
                let icoords = Cell.getInnerCoords();
                if (icoords[0] == coords[0] && icoords[1] == coords[1]) { 
                    return Cell;
                    break;
                }
            }
            return false;
        }
        else {
            return false;
        }
    }

    getAdjacentCells (daCell, dist) {
        let coords = daCell.getInnerCoords();
        let xmin = coords[0] - dist;
        let xmax = coords[0] + dist;
        let ymax = coords[1] + dist;
        let ymin = coords[1] - dist;
        
        let cellList = []
        for (let y = ymin; y <= ymax; y++) {
            for (let x = xmin; x <= xmax; x++) {
                if (!this.isOutOfBorder([x,y])) {
                    if (x == coords[0] && y == coords[1]) { //do not count if is the same cell that requested adjacent.
                        //console.log('[' + x + ',' + y + '] is the same');
                    }
                    else {
                        //console.log('[' + x + ',' + y + ']');
                        cellList.push(this.getCell([x,y]));
                    }
                }
            
            }
        }
        return cellList;
    }

    setNumbers () {
        let i = []
        for (let y = 0; y < this.grid.length; y++) {

            let Cell = this.grid[y]
            let yy = this.bombsAround(Cell)

            Cell.setNum(yy.length);
        }
    }

    bombsAround(Cell) {
        let i = this.getAdjacentCells(Cell,1);
        let yy = []
        for (let j = 0; j < i.length; j++) {
            if (i[j].hasBomb()) {
                yy.push(i[j]);
            }
        }
        return yy;
    }

    hasBombsAround (Cell) {
        let i = this.bombsAround(Cell);
        return (i.length != 0);
    }


    drawAllBoard () {
        for (let y = 0; y < this.grid.length; y++) {
            let Cell = this.grid[y];
            Cell.draw();
            //drawCell([Cell.getX(), Cell.getY()], this.dim , Cell.getType());
        }
    }

    showBombs () { 
        console.log('bout to check bombs');
        drawBombs(this.bombs);
    }
}

function drawBombs(bombs) {
    var num = 0;



    /*while (num < 100) {
        var timeoutID = setTimeout(drawNewBomb(), 5000);
    }*/
    var interval = setInterval(function () {
        console.log(num);
        if (num >= bombs.length - 1) {
            clearInterval(interval);
        }
        bombs[num].revealBomb ();
        num++;
    }, 50);
}