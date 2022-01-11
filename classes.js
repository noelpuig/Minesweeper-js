class cell {
    constructor(posx, posy, type, hidden, innercoords, dimensions) {
        this.y = posy;
        this.x = posx; //positions in pixels
        this.innercoords = innercoords; //cell position inside the grid. example: [6,3]. top-right will be [0,0]
        this.dim = dimensions; //dims in pixels
        this.hasbomb = false; 
        this.hidden = hidden; // if the cell has been clicked and revealed 
        this.number = 0;    // bombs the cell has around, to be set by Grid after creation
        this.flagged = false; //will contain if the cell has a flag on it

        
        this.img = new Image();
        this.img.src = 'C:\\Users\\noelp\\Desktop\\buscamines\\flag.png'; //defines the flag image
    }
    getCoords() {
        return [this.x, this.y]; 
    }
    flag () {
        if (this.flagged == true) {this.flagged = false;}
        else {this.flagged = true;}
        return false; //switches if it has a flag
    }
    isFlagged () {
        return this.flagged;
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
 
    setNum (value) {
        this.number = value;
    }
    getNum () {return this.number;}
    hide(value) {
        this.hidden = value;
        /*
        if you reveal the cell, flag must go. 
        This is used when it reveals a big chunk of cells since clicking on a cell isn't allowed anyway.
        */
        if (value == false) {  
            this.flagged = false;
        }
    }
    ishidden () {
        return this.hidden;
    }
    draw() {
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
               
            if (this.number != 0) {     // color of the cell's number will change like the original 
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
    revealBomb () { // Used for when you loose and all bombs show up. 
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
        this.bomb_n = bomb_n; // number of bombs grid will have.

        this.grid = [];
        this.dim = 25; //each cell's dimension, could also be done by canvas.size/cell_number but this was good enough in this case.

        this.hor = width/this.dim; // number of cells in the rows and columns
        this.ver = height/this.dim;

        for (let y = 0; y < this.ver; y++) { // creates cells and appends to a grid list. 
            for (let x = 0; x < this.hor; x++) {
                this.grid.push(new cell(x * this.dim , y * this.dim, 'default', true, [x, y], this.dim));
            }   
        }

        //creates positions for bombs
        //basically randomly selects selects cells from the list and adds them a bomb.
        //also makes a list of the bombs for easy access.

        let positions = []; 
        for (let y = 0; y < this.bomb_n; y++) { 
            let max = this.grid.length;
            let min = 0;
            positions.push(Math.round(Math.random() * (max - min) + min)); //this is a random number
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
        //basically checks if a cell exists
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

    getCell (coords) { //this will return a cell feeding it its coordiantes inside the grid(ex. [3,5])
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

    getAdjacentCells (daCell, dist) { //will return the cells around a cell
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
                    }
                    else {
                        cellList.push(this.getCell([x,y]));
                    }
                }
            
            }
        }
        return cellList;
    }

    setNumbers () { //checks how many bombs does each cell have around and sets their number
        let i = []
        for (let y = 0; y < this.grid.length; y++) {

            let Cell = this.grid[y]
            let yy = this.bombsAround(Cell)

            Cell.setNum(yy.length);
        }
    }

    bombsAround(Cell) { //getAdjacent but with bombs
        let i = this.getAdjacentCells(Cell,1);
        let yy = []
        for (let j = 0; j < i.length; j++) {
            if (i[j].hasBomb()) {
                yy.push(i[j]);
            }
        }
        return yy;
    }

    hasBombsAround (Cell) { //bombsAround but as boolean
        let i = this.bombsAround(Cell);
        return (i.length != 0);
    }


    drawAllBoard () { //draws all cells, used for example at start.
        for (let y = 0; y < this.grid.length; y++) {
            let Cell = this.grid[y];
            Cell.draw();
        }
    }

    showBombs () { //cool animation for when you loose.
        console.log('bout to check bombs');
        drawBombs(this.bombs);
    }
}

function drawBombs(bombs) {
    var num = 0;

    var interval = setInterval(function () { //sets interval to make bombs appear one by one.
        console.log(num);
        if (num >= bombs.length - 1) {
            clearInterval(interval);
        }
        bombs[num].revealBomb ();
        num++;
    }, 50);
}