class Move{

  //
  // types can be:
  //              capture (schlagen einer Figur),
  //              move (simple move),
  //              en passant (nur bei Bauern muss gesondert behandelt werden)
  //              check (Angriff auf den König)
  //              transformation (of a pawn to another piece on the Ground line)
  //

  constructor(pos1, pos2, piece = "pawn", type = "default"){

    this.pos1 = pos1;
    this.pos2 = pos2;
    this.piece = piece;
    this.type = type;

  }

}
