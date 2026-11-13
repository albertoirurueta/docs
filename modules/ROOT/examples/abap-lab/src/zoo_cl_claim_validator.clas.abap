CLASS zoo_cl_claim_validator DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS constructor
      IMPORTING max_amount TYPE i.
    METHODS is_within_limit
      IMPORTING amount        TYPE i
      RETURNING VALUE(within) TYPE abap_bool.
    METHODS validate
      IMPORTING claim_id TYPE i
                amount   TYPE i
      RAISING   zoo_cx_claim_invalid.
  PRIVATE SECTION.
    DATA max_amount TYPE i.
ENDCLASS.

CLASS zoo_cl_claim_validator IMPLEMENTATION.
  METHOD constructor.
    me->max_amount = max_amount.
  ENDMETHOD.

  METHOD is_within_limit.
    within = xsdbool( amount > 0 AND amount <= max_amount ).
  ENDMETHOD.

  METHOD validate.
    IF is_within_limit( amount ) = abap_false.
      RAISE EXCEPTION NEW zoo_cx_claim_invalid(
        claim_id = claim_id
        reason   = |amount { amount } is not between 1 and { max_amount }| ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
