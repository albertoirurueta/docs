CLASS zoo_cx_claim_invalid DEFINITION PUBLIC
  INHERITING FROM cx_static_check FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    DATA claim_id TYPE i READ-ONLY.
    DATA reason   TYPE string READ-ONLY.
    METHODS constructor
      IMPORTING claim_id TYPE i
                reason   TYPE string.
    METHODS if_message~get_text REDEFINITION.
ENDCLASS.

CLASS zoo_cx_claim_invalid IMPLEMENTATION.
  METHOD constructor.
    super->constructor( ).
    me->claim_id = claim_id.
    me->reason = reason.
  ENDMETHOD.

  METHOD if_message~get_text.
    result = |Claim { claim_id } rejected: { reason }|.
  ENDMETHOD.
ENDCLASS.
