CLASS zoo_cl_full_payout DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zoo_if_payout.
ENDCLASS.

CLASS zoo_cl_full_payout IMPLEMENTATION.
  METHOD zoo_if_payout~get_name.
    name = `Full payout`.
  ENDMETHOD.

  METHOD zoo_if_payout~calculate.
    payout = claimed.
  ENDMETHOD.
ENDCLASS.
