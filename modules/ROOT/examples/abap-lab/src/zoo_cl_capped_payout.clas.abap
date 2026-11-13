CLASS zoo_cl_capped_payout DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zoo_if_payout.
    METHODS constructor
      IMPORTING cap TYPE i.
  PRIVATE SECTION.
    DATA cap TYPE i.
ENDCLASS.

CLASS zoo_cl_capped_payout IMPLEMENTATION.
  METHOD constructor.
    me->cap = cap.
  ENDMETHOD.

  METHOD zoo_if_payout~get_name.
    name = |Capped payout (cap { cap })|.
  ENDMETHOD.

  METHOD zoo_if_payout~calculate.
    IF claimed > cap.
      payout = cap.
    ELSE.
      payout = claimed.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
