CLASS zlint_claims DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    TYPES tt_amounts TYPE STANDARD TABLE OF i WITH EMPTY KEY.
    METHODS total
      IMPORTING it_amounts TYPE tt_amounts
      EXPORTING ev_total   TYPE i.
ENDCLASS.

CLASS zlint_claims IMPLEMENTATION.
  METHOD total.
    DATA lv_unused TYPE i.
    DATA lv_amount TYPE i.

    ev_total = 0.
    loop AT it_amounts INTO lv_amount.
      ev_total = ev_total + lv_amount.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.
