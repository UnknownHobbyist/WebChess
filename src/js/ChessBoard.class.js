class ChessBoard{

  constructor(){

    this.field = new Array(8);

    for(let i = 0; i < 8; i++){

      this.field[i] = new Array(8);

      for(let j = 0; j < 8; j++){

        this.field[i][j] = 0;

      }

    }


  }
  
  updatePieces(){

    for(let i = 0; i < this.field.length; i++){

      for(let j = 0; j < this.field[i].length; j++){

        let board_field = document.getElementById("c-board").children[8*i + j];

        if(board_field.tagName !== "C-FIELD")
          continue;

        board_field.innerHTML = "";

        let piece = document.createElement("c-piece");
        piece.setAttribute("class", this.field[i][j]);
        board_field.appendChild(piece);

      }

    }

  }

}
