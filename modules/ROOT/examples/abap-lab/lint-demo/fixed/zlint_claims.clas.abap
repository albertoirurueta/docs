CLASS zlint_claims DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    TYPES amounts TYPE STANDARD TABLE OF i WITH EMPTY KEY.
    METHODS total
      IMPORTING claim_amounts TYPE amounts
      RETURNING VALUE(result) TYPE i.
ENDCLASS.

CLASS zlint_claims IMPLEMENTATION.
  METHOD total.
    LOOP AT claim_amounts INTO DATA(amount).
      result = result + amount.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.
