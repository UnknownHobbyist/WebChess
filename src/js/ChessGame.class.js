class ChessGame{

  constructor(type = "normal", time = "-1"){

    this.type = type;
    this.turns = new Array();
    this.time = time;
    this.domBoard = document.getElementById("c-board");
    this.board = new ChessBoard();
    this.PIECES = Object.freeze({"BLACK_ROOK":"black_rook", "BLACK_KNIGHT":"black_knight", "BLACK_BISHOP":"black_bishop", "BLACK_QUEEN":"black_queen", "BLACK_KING":"black_king", "BLACK_PAWN":"black_pawn", "WHITE_ROOK":"white_rook", "WHITE_KNIGHT":"white_knight", "WHITE_BISHOP":"white_bishop", "WHITE_QUEEN":"white_queen", "WHITE_KING":"white_king", "WHITE_PAWN":"white_pawn"});

    this.playersTurn = "white";

  }
  movePiece(mov){

    let piece = this.getPiece(mov.pos1.x, mov.pos1.y);

    if(this.getColorFromPiece(piece) !== this.playersTurn || this.piece == 0)
      return;

    let possibleMoves = this.getPossibleMoves(mov.pos1);

    for(let i = 0; i < possibleMoves.length; i++){

      if(possibleMoves[i].y == mov.pos2.y && possibleMoves[i].x == mov.pos2.x){

        if(possibleMoves[i].type != "undefined"){

          switch(possibleMoves[i].type){

            case "en_passant" :
              this.setPiece(new Position(possibleMoves[i].rem_x, possibleMoves[i].rem_y), 0);


          }

        }

        this.setPiece(mov.pos2, this.getPiece(mov.pos1.x, mov.pos1.y));
        this.setPiece(mov.pos1, 0);


        this.board.updatePieces();

        this.turns.push(mov);

        if(this.playersTurn == "white"){
          this.playersTurn = "black";
        }else{
          this.playersTurn = "white";
        }

        break;

      }

    }

  }
  getPossibleMoves(pos){

    let moves = new Array();
    let piece = this.getPiece(pos.x, pos.y), color, type, x, y, i;

    if(piece != 0){

      color = this.getColorFromPiece(piece);
      type = this.getPieceType(piece);

      switch(type){

        case "pawn" :

          if(color === "black"){
            /*standard forward moves*/
            if(this.getPiece(pos.x, pos.y + 1) == 0){
              moves.push(new Position(pos.x, pos.y + 1));
              if(pos.y == 1 && this.getPiece(pos.x, pos.y + 2) == 0)
                moves.push(new Position(pos.x, pos.y + 2));
            }

            /*capturing*/
            if(this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y + 1)) == "white")
              moves.push(new Position(pos.x + 1, pos.y + 1));
            if(this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y + 1)) == "white")
              moves.push(new Position(pos.x - 1, pos.y + 1));

            /*en passant*/
            if(this.getPiece(pos.x - 1, pos.y) == "white_pawn"){
              let latest_enemy_move = this.turns[this.turns.length - 1];
              if(latest_enemy_move.pos2.x == pos.x - 1 && latest_enemy_move.pos2.y - latest_enemy_move.pos1.y == -2)
                moves.push({"x" : pos.x - 1, "y" : pos.y + 1, "type" : "en_passant", "rem_x" : pos.x - 1, "rem_y" : pos.y});
            }

            if(this.getPiece(pos.x + 1, pos.y) == "white_pawn"){
              let latest_enemy_move = this.turns[this.turns.length - 1];
              if(latest_enemy_move.pos2.x == pos.x + 1 && latest_enemy_move.pos2.y - latest_enemy_move.pos1.y == -2)
                moves.push({"x" : pos.x + 1, "y" : pos.y + 1, "type" : "en_passant", "rem_x" : pos.x + 1, "rem_y" : pos.y});
            }

          }else{
            /*standard forward moves*/
            if(this.getPiece(pos.x, pos.y - 1) == 0){
              moves.push(new Position(pos.x, pos.y - 1));
              if(pos.y == 6 && this.getPiece(pos.x, pos.y - 2) == 0)
                moves.push(new Position(pos.x, pos.y - 2));
            }

            /*capturing*/
            if(this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y - 1)) == "black")
              moves.push(new Position(pos.x + 1, pos.y - 1));
            if(this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y - 1)) == "black")
              moves.push(new Position(pos.x - 1, pos.y - 1));

            /*en passant*/
            if(this.getPiece(pos.x - 1, pos.y) == "black_pawn" && this.turns.length >= 1){
              let latest_enemy_move = this.turns[this.turns.length - 1];
              if(latest_enemy_move.pos2.x == pos.x - 1 && latest_enemy_move.pos2.y - latest_enemy_move.pos1.y == 2)
                moves.push({"x" : pos.x - 1, "y" : pos.y - 1, "type" : "en_passant", "rem_x" : pos.x - 1, "rem_y" : pos.y});
            }

            if(this.getPiece(pos.x + 1, pos.y) == "black_pawn" && this.turns.length >= 1){
              let latest_enemy_move = this.turns[this.turns.length - 1];
              if(latest_enemy_move.pos2.x == pos.x + 1 && latest_enemy_move.pos2.y - latest_enemy_move.pos1.y == 2)
                moves.push({"x" : pos.x + 1, "y" : pos.y - 1, "type" : "en_passant", "rem_x" : pos.x + 1, "rem_y" : pos.y});
            }

          }
          break;
        case "rook" :

          /*Standard moves and Capturing*/
          for(i = pos.x + 1; i < 8; i++){
            if(this.getPiece(i, pos.y) == 0){
              moves.push(new Position(i, pos.y));
            }else{
              if(this.getColorFromPiece(this.getPiece(i, pos.y)) != color)
                moves.push(new Position(i, pos.y));
              break;
            }
          }

          for(i = pos.x - 1; i >= 0; i--){
            if(this.getPiece(i, pos.y) == 0){
              moves.push(new Position(i, pos.y));
            }else{
              if(this.getColorFromPiece(this.getPiece(i, pos.y)) != color)
                moves.push(new Position(i, pos.y));
              break;
            }
          }

          for(i = pos.y + 1; i < 8; i++){
            if(this.getPiece(pos.x, i) == 0){
              moves.push(new Position(pos.x, i));
            }else{
              if(this.getColorFromPiece(this.getPiece(pos.x, i)) != color)
                moves.push(new Position(pos.x, i));
              break;
            }
          }

          for(i = pos.y - 1; i >= 0; i--){
            if(this.getPiece(pos.x, i) == 0){
              moves.push(new Position(pos.x, i));
            }else{
              if(this.getColorFromPiece(this.getPiece(pos.x, i)) != color)
                moves.push(new Position(pos.x, i));
              break;
            }
          }

          break;
        case "knight" :

          if((this.getPiece(pos.x + 2, pos.y - 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 2, pos.y - 1)) != color) && this.isPossiblePosition(pos.x + 2, pos.y - 1))
            moves.push(new Position(pos.x + 2, pos.y - 1));

          if((this.getPiece(pos.x + 2, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 2, pos.y + 1)) != color) && this.isPossiblePosition(pos.x + 2, pos.y + 1))
            moves.push(new Position(pos.x + 2, pos.y + 1));

          if((this.getPiece(pos.x + 1, pos.y - 2) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y - 2)) != color) && this.isPossiblePosition(pos.x + 1, pos.y - 2))
            moves.push(new Position(pos.x + 1, pos.y - 2));

          if((this.getPiece(pos.x - 1, pos.y - 2) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y - 2)) != color) && this.isPossiblePosition(pos.x - 1, pos.y - 2))
            moves.push(new Position(pos.x - 1, pos.y - 2));

          if((this.getPiece(pos.x - 2, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 2, pos.y + 1)) != color) && this.isPossiblePosition(pos.x - 2, pos.y + 1))
            moves.push(new Position(pos.x - 2, pos.y - 1));

          if((this.getPiece(pos.x - 2, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 2, pos.y + 1)) != color) && this.isPossiblePosition(pos.x - 2, pos.y - 1))
            moves.push(new Position(pos.x - 2, pos.y - 1));

          if((this.getPiece(pos.x - 1, pos.y + 2) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y + 2)) != color) && this.isPossiblePosition(pos.x - 1, pos.y + 2))
            moves.push(new Position(pos.x - 1, pos.y + 2));

          if((this.getPiece(pos.x + 1, pos.y + 2) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y + 2)) != color) && this.isPossiblePosition(pos.x + 1, pos.y + 2))
            moves.push(new Position(pos.x + 1, pos.y + 2));

          break;
        case "bishop" :

          x = pos.x;
          y = pos.y;

          while(x < 8 && y < 8){
            y++;
            x++;

            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while(x >= 0 && y < 8){
            y++;
            x--;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while( x < 8 && y >= 0){
            y--;
            x++;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while(x >= 0 && y >= 0){
            y--;
            x--;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          break;
        case "queen" :

          /*BISHOP*/
          x = pos.x;
          y = pos.y;

          while(x < 8 && y < 8){
            y++;
            x++;

            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while(x >= 0 && y < 8){
            y++;
            x--;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while( x < 8 && y >= 0){
            y--;
            x++;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          x = pos.x;
          y = pos.y;

          while(x >= 0 && y >= 0){
            y--;
            x--;
            if(this.getPiece(x, y) == 0){
              moves.push(new Position(x, y));
            }else{
              if(this.getColorFromPiece(this.getPiece(x, y)))
                moves.push(new Position(x, y));
              break;
            }
          }

          /*ROOK*/
          /*Standard moves and Capturing*/
          for(i = pos.x + 1; i < 8; i++){
            if(this.getPiece(i, pos.y) == 0){
              moves.push(new Position(i, pos.y));
            }else{
              if(this.getColorFromPiece(this.getPiece(i, pos.y)) != color)
                moves.push(new Position(i, pos.y));
              break;
            }
          }

          for(i = pos.x - 1; i >= 0; i--){
            if(this.getPiece(i, pos.y) == 0){
              moves.push(new Position(i, pos.y));
            }else{
              if(this.getColorFromPiece(this.getPiece(i, pos.y)) != color)
                moves.push(new Position(i, pos.y));
              break;
            }
          }

          for(i = pos.y + 1; i < 8; i++){
            if(this.getPiece(pos.x, i) == 0){
              moves.push(new Position(pos.x, i));
            }else{
              if(this.getColorFromPiece(this.getPiece(pos.x, i)) != color)
                moves.push(new Position(pos.x, i));
              break;
            }
          }

          for(i = pos.y - 1; i >= 0; i--){
            if(this.getPiece(pos.x, i) == 0){
              moves.push(new Position(pos.x, i));
            }else{
              if(this.getColorFromPiece(this.getPiece(pos.x, i)) != color)
                moves.push(new Position(pos.x, i));
              break;
            }
          }

          break;
        case "king" :

          if((this.getPiece(pos.x + 1, pos.y) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y)) != color) && this.isPossiblePosition(pos.x + 1, pos.y))
            moves.push(new Position(pos.x + 1, pos.y));

          if((this.getPiece(pos.x + 1, pos.y - 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y - 1)) != color) && this.isPossiblePosition(pos.x + 1, pos.y - 1))
            moves.push(new Position(pos.x + 1, pos.y - 1));

          if((this.getPiece(pos.x, pos.y - 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x, pos.y - 1)) != color) && this.isPossiblePosition(pos.x, pos.y - 1))
            moves.push(new Position(pos.x, pos.y - 1));

          if((this.getPiece(pos.x - 1, pos.y - 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y - 1)) != color) && this.isPossiblePosition(pos.x - 1, pos.y - 1))
            moves.push(new Position(pos.x - 1, pos.y - 1));

          if((this.getPiece(pos.x - 1, pos.y) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y)) != color) && this.isPossiblePosition(pos.x - 1, pos.y))
            moves.push(new Position(pos.x - 1, pos.y));

          if((this.getPiece(pos.x - 1, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x - 1, pos.y + 1)) != color) && this.isPossiblePosition(pos.x - 1, pos.y + 1))
            moves.push(new Position(pos.x - 1, pos.y + 1));

          if((this.getPiece(pos.x, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x, pos.y + 1)) != color) && this.isPossiblePosition(pos.x, pos.y + 1))
            moves.push(new Position(pos.x, pos.y + 1));

          if((this.getPiece(pos.x + 1, pos.y + 1) == 0 || this.getColorFromPiece(this.getPiece(pos.x + 1, pos.y + 1)) != color) && this.isPossiblePosition(pos.x + 1, pos.y + 1))
            moves.push(new Position(pos.x + 1, pos.y + 1));

          break;
      }

    }else{
      return moves;
    }
    return moves;
  }
  getAttackedFields(color){

    let attacked_fields = new Set(), x, y, i;

    for(let field_x = 0; field_x < 8; field_x++){

      for(let field_y = 0; field_y < 8; field_y++){

        if(this.getColorFromPiece(this.getPiece(field_x, field_y)) != "color"){

          switch(this.getPieceType(this.getPiece(field_x, field_y))){

            case "pawn" :
              if(color === "white"){

                attacked_fields.add(new Position(field_x-1, field_y+1));
                attacked_fields.add(new Position(field_x-1, field_y-1));

              }else if(color === "black"){

                attacked_fields.add(new Position(field_x+1, field_y+1));
                attacked_fields.add(new Position(field_x+1, field_y-1));

              }
              break;
            case "rook" :

              /*Standard moves and Capturing*/
              for(i = field_x + 1; i < 8; i++){
                if(this.getPiece(i, field_y) == 0){
                  attacked_fields.add(new Position(i, field_y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(i, field_y)) != color)
                    attacked_fields.add(new Position(i, field_y));
                  break;
                }
              }

              for(i = field_x - 1; i >= 0; i--){
                if(this.getPiece(i, field_y) == 0){
                  attacked_fields.add(new Position(i, field_y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(i, field_y)) != color)
                    attacked_fields.add(new Position(i, field_y));
                  break;
                }
              }

              for(i = field_y + 1; i < 8; i++){
                if(this.getPiece(field_x, i) == 0){
                  attacked_fields.add(new Position(field_x, i));
                }else{
                  if(this.getColorFromPiece(this.getPiece(field_x, i)) != color)
                    attacked_fields.add(new Position(field_x, i));
                  break;
                }
              }

              for(i = field_y - 1; i >= 0; i--){
                if(this.getPiece(field_x, i) == 0){
                  attacked_fields.add(new Position(field_x, i));
                }else{
                  if(this.getColorFromPiece(this.getPiece(field_x, i)) != color)
                    attacked_fields.add(new Position(field_x, i));
                  break;
                }
              }

              break;
            case "knight" :
              if((this.getPiece(field_x + 2, field_y - 1) == 0 || this.getColorFromPiece(this.getPiece(field_x + 2, field_y - 1)) != color) && this.isPossiblePosition(field_x + 2, field_y - 1))
                attacked_fields.add(new Position(field_x + 2, field_y - 1));

              if((this.getPiece(field_x + 2, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x + 2, field_y + 1)) != color) && this.isPossiblePosition(field_x + 2, field_y + 1))
                attacked_fields.add(new Position(field_x + 2, field_y + 1));

              if((this.getPiece(field_x + 1, field_y - 2) == 0 || this.getColorFromPiece(this.getPiece(field_x + 1, field_y - 2)) != color) && this.isPossiblePosition(field_x + 1, field_y - 2))
                attacked_fields.add(new Position(field_x + 1, field_y - 2));

              if((this.getPiece(field_x - 1, field_y - 2) == 0 || this.getColorFromPiece(this.getPiece(field_x - 1, field_y - 2)) != color) && this.isPossiblePosition(field_x - 1, field_y - 2))
                attacked_fields.add(new Position(field_x - 1, field_y - 2));

              if((this.getPiece(field_x - 2, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x - 2, field_y + 1)) != color) && this.isPossiblePosition(field_x - 2, field_y + 1))
                attacked_fields.add(new Position(field_x - 2, field_y - 1));

              if((this.getPiece(field_x - 2, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x - 2, field_y + 1)) != color) && this.isPossiblePosition(field_x - 2, field_y - 1))
                attacked_fields.add(new Position(field_x - 2, field_y - 1));

              if((this.getPiece(field_x - 1, field_y + 2) == 0 || this.getColorFromPiece(this.getPiece(field_x - 1, field_y + 2)) != color) && this.isPossiblePosition(field_x - 1, field_y + 2))
                attacked_fields.add(new Position(field_x - 1, field_y + 2));

              if((this.getPiece(field_x + 1, field_y + 2) == 0 || this.getColorFromPiece(this.getPiece(field_x + 1, field_y + 2)) != color) && this.isPossiblePosition(field_x + 1, field_y + 2))
                attacked_fields.add(new Position(field_x + 1, field_y + 2));

              break;
            case "bishop" :

              x = field_x;
              y = field_y;

              while(x < 8 && y < 8){
                y++;
                x++;

                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while(x >= 0 && y < 8){
                y++;
                x--;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while( x < 8 && y >= 0){
                y--;
                x++;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while(x >= 0 && y >= 0){
                y--;
                x--;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              break;
            case "queen" :
              /*BISHOP*/
              x = field_x;
              y = field_y;

              while(x < 8 && y < 8){
                y++;
                x++;

                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while(x >= 0 && y < 8){
                y++;
                x--;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while( x < 8 && y >= 0){
                y--;
                x++;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              x = field_x;
              y = field_y;

              while(x >= 0 && y >= 0){
                y--;
                x--;
                if(this.getPiece(x, y) == 0){
                  attacked_fields.add(new Position(x, y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(x, y)))
                    attacked_fields.add(new Position(x, y));
                  break;
                }
              }

              /*ROOK*/
              /*Standard moves and Capturing*/
              for(i = field_x + 1; i < 8; i++){
                if(this.getPiece(i, field_y) == 0){
                  attacked_fields.add(new Position(i, field_y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(i, field_y)) != color)
                    attacked_fields.add(new Position(i, field_y));
                  break;
                }
              }

              for(i = field_x - 1; i >= 0; i--){
                if(this.getPiece(i, field_y) == 0){
                  attacked_fields.add(new Position(i, field_y));
                }else{
                  if(this.getColorFromPiece(this.getPiece(i, field_y)) != color)
                    attacked_fields.add(new Position(i, field_y));
                  break;
                }
              }

              for(i = field_y + 1; i < 8; i++){
                if(this.getPiece(field_x, i) == 0){
                  attacked_fields.add(new Position(field_x, i));
                }else{
                  if(this.getColorFromPiece(this.getPiece(field_x, i)) != color)
                    attacked_fields.add(new Position(field_x, i));
                  break;
                }
              }

              for(i = field_y - 1; i >= 0; i--){
                if(this.getPiece(field_x, i) == 0){
                  attacked_fields.add(new Position(field_x, i));
                }else{
                  if(this.getColorFromPiece(this.getPiece(field_x, i)) != color)
                    attacked_fields.add(new Position(field_x, i));
                  break;
                }
              }
              break;
            case "king" :
              if((this.getPiece(field_x + 1, field_y) == 0 || this.getColorFromPiece(this.getPiece(field_x + 1, field_y)) != color) && this.isPossiblePosition(field_x + 1, field_y))
                attacked_fields.add(new Position(field_x + 1, field_y));

              if((this.getPiece(field_x + 1, field_y - 1) == 0 || this.getColorFromPiece(this.getPiece(field_x + 1, field_y - 1)) != color) && this.isPossiblePosition(field_x + 1, field_y - 1))
                attacked_fields.add(new Position(field_x + 1, field_y - 1));

              if((this.getPiece(field_x, field_y - 1) == 0 || this.getColorFromPiece(this.getPiece(field_x, field_y - 1)) != color) && this.isPossiblePosition(field_x, field_y - 1))
                attacked_fields.add(new Position(field_x, field_y - 1));

              if((this.getPiece(field_x - 1, field_y - 1) == 0 || this.getColorFromPiece(this.getPiece(field_x - 1, field_y - 1)) != color) && this.isPossiblePosition(field_x - 1, field_y - 1))
                attacked_fields.add(new Position(field_x - 1, field_y - 1));

              if((this.getPiece(field_x - 1, field_y) == 0 || this.getColorFromPiece(this.getPiece(field_x - 1, field_y)) != color) && this.isPossiblePosition(field_x - 1, field_y))
                attacked_fields.add(new Position(field_x - 1, field_y));

              if((this.getPiece(field_x - 1, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x - 1, field_y + 1)) != color) && this.isPossiblePosition(field_x - 1, field_y + 1))
                attacked_fields.add(new Position(field_x - 1, field_y + 1));

              if((this.getPiece(field_x, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x, field_y + 1)) != color) && this.isPossiblePosition(field_x, field_y + 1))
                attacked_fields.add(new Position(field_x, field_y + 1));

              if((this.getPiece(field_x + 1, field_y + 1) == 0 || this.getColorFromPiece(this.getPiece(field_x + 1, field_y + 1)) != color) && this.isPossiblePosition(field_x + 1, field_y + 1))
                attacked_fields.add(new Position(field_x + 1, field_y + 1));
              break;

          }

        }

      }

    }

    return attacked_fields;

  }
  getColorFromPiece(piece){

    if(typeof piece !== "string")
      return "";

    return piece.match(/[^_]+/i)[0];

  }
  getPieceType(piece){

    if(typeof piece !== "string")
      return "";

    return piece.replace(/[^_]+_/i, "");

  }
  getPiece(x, y){

    if(this.isPossiblePosition(x, y))
      return this.board.field[y][x];

    return 0;

  }
  setPiece(pos, piece){
    this.board.field[pos.y][pos.x] = piece;
  }
  isPossiblePosition(x, y){

    if(x >= 0 && x < 8 && y >= 0 && y < 8)
      return true;

    return false;

  }
  isThreatenedField(x, y, color){

    if(!this.isPossiblePosition(x, y))
      return true;

    let attacked_fields = this.getAttackedFields(color).entries();

    for(let item of attacked_fields){

      if(item[0].x == x && item[0].y == y)
        return true;

    }

    return false;

  }

}
