CLASS zcl_first_program DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS run.
ENDCLASS.

CLASS zcl_first_program IMPLEMENTATION.
  METHOD run.
    DATA claim_id TYPE i VALUE 1001.
    DATA status   TYPE string VALUE `New`.
    DATA amount   TYPE i VALUE 45.

    WRITE / |Claim { claim_id }|.
    WRITE / |Status: { status }|.
    WRITE / |Amount: { amount } EUR|.
  ENDMETHOD.
ENDCLASS.
